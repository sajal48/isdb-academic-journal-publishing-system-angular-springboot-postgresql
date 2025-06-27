import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, forkJoin, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Discussion, DiscussionOrigin, Manuscript, SubmissionFile } from '../user-manuscript.component';
import { Journal, JournalIssue, UserManuscriptService } from '../../../site-settings/manuscript/user-manuscript.service';
import { AuthLoginRegisterService } from '../../../site-settings/auth/auth-login-register.service';
import { UserToastNotificationService } from '../../../site-settings/toast-popup/user-toast-notification.service';

// Declare bootstrap to avoid TypeScript errors if not imported as a module
declare var bootstrap: any;

interface JournalIssueDisplay {
  id: number;
  journalName: string;
  volumeNumber: number;
  issueNumber: number;
  year: number;
}

@Component({
  selector: 'app-manuscript-publication',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './manuscript-publication.component.html',
  styleUrls: ['./manuscript-publication.component.css'],
  standalone: true
})
export class ManuscriptPublicationComponent implements OnInit {
  manuscript!: Manuscript;
  currentUserId: number = 0;

  publicationFiles: SubmissionFile[] = [];
  keywordsArray: string[] = [];

  // For Journal/Issue Selection
  issues: JournalIssueDisplay[] = [];
  selectedIssueId: number | null = null;

  // For Modals
  confirmationMessage: string = '';
  currentAction: string = '';
  private othersUserId: number = 0;
  private loggedUserId: number = 0;
  currentUserRole: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private userManuscriptService: UserManuscriptService,
    private authLoginRegisterService: AuthLoginRegisterService,
    private userToastNotificationService: UserToastNotificationService
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.authLoginRegisterService.getUserRole();
    this.loggedUserId = this.authLoginRegisterService.getUserID();
    
    this.othersUserId = this.route.snapshot.queryParams['userId'];
    if (this.othersUserId == null) {
      this.currentUserId = this.authLoginRegisterService.getUserID();
    } else {
      this.currentUserId = this.othersUserId;
    }

    this.route.parent?.paramMap.pipe(
      switchMap(params => {
        const manuscriptId = params.get('manuscriptId');
        if (manuscriptId && this.currentUserId) {
          return this.userManuscriptService.getManuscriptById(this.currentUserId, manuscriptId);
        }
        return of(undefined);
      })
    ).subscribe(manuscript => {
      if (manuscript) {
        this.manuscript = manuscript;
        console.log('Manuscript loaded for publication:', this.manuscript);
        this.filterFiles();
        this.processKeywords();
        this.loadIssues();
      } else {
        console.error('Manuscript not found.');
        this.userToastNotificationService.showToast('Error', 'Manuscript not found.', 'danger');
        this.router.navigate(['/user/dashboard']);
      }
    });
  }

  processKeywords(): void {
    if (this.manuscript.manuscriptKeywords) {
      this.keywordsArray = this.manuscript.manuscriptKeywords
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);
    }
  }

  filterFiles(): void {
    if (this.manuscript && this.manuscript.files) {
      this.publicationFiles = this.manuscript.files.filter(file =>
        file.isPublicationFile || file.fileOrigin === 'PUBLICATION');
    }
  }

  loadIssues(): void {
    if (!this.manuscript || !this.manuscript.journal?.id) {
      console.warn('Cannot load issues: Manuscript or Journal ID is missing.');
      return;
    }

    this.userManuscriptService.getAllJournals().subscribe({
      next: (journals: Journal[]) => {
        const currentJournal = journals.find(j => j.id === this.manuscript.journal?.id);
        if (currentJournal && currentJournal.issues) {
          this.issues = currentJournal.issues
            .filter(issue => issue.status === 'FUTURE' || issue.status === 'PUBLISHED') // Show future and published issues
            .map(issue => ({
              id: issue.id,
              journalName: currentJournal.journalName,
              volumeNumber: issue.volume,
              issueNumber: issue.number,
              year: new Date(issue.publicationDate).getFullYear()
            }));
          console.log('Loaded issues:', this.issues);
        } else {
          console.log('No issues found for this journal or journal not found in the list.');
          this.issues = [];
        }
      },
      error: (err) => {
        console.error('Error loading journal issues:', err);
        this.userToastNotificationService.showToast('Error', 'Failed to load journal issues.', 'danger');
        this.issues = [];
      }
    });
  }

  hasPublicationFiles(): boolean {
    return this.publicationFiles.length > 0;
  }

  downloadFile(url: string, fileName: string): void {
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = downloadUrl;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        a.remove();
        this.userToastNotificationService.showToast('Success', `${fileName} downloaded successfully!`, 'success');
      },
      error: (error) => {
        console.error('Download error:', error);
        this.userToastNotificationService.showToast('Error', `Failed to download ${fileName}.`, 'danger');
      }
    });
  }

  openPublicationActionModal(action: string): void {
    this.currentAction = action;
    switch (action) {
      case 'publishArticle':
        this.confirmationMessage = 'Are you sure you want to publish this article? This will make it publicly available.';
        break;
      case 'unpublishArticle':
        this.confirmationMessage = 'WARNING: Are you sure you want to unpublish this article? This will remove it from public view.';
        break;
      default:
        this.confirmationMessage = 'Are you sure you want to proceed with this action?';
    }
    this.openModal('publicationConfirmationModal');
  }

  confirmPublicationAction(): void {
    if (!this.manuscript?.id) {
      this.userToastNotificationService.showToast('Error', 'Manuscript ID missing.', 'danger');
      return;
    }

    const manuscriptId = Number(this.manuscript.id);
    let statusToUpdate = '';
    let successMessage = '';

    switch (this.currentAction) {
      case 'publishArticle':
        if (this.selectedIssueId === null) {
          this.userToastNotificationService.showToast('Error', 'Please select an issue for publication.', 'danger');
          return;
        }
        statusToUpdate = 'PUBLISHED';
        successMessage = 'Article published successfully!';

        const publicationFile = this.publicationFiles[0]; // Assuming the first file in publicationFiles is the primary one
        if (!publicationFile) {
          this.userToastNotificationService.showToast('Error', 'No publication file found to assign.', 'danger');
          return;
        }

        // Chain the calls: Select file for publication -> Publish article -> Update submission status
        this.userManuscriptService.selectFileForPublication(manuscriptId, publicationFile.id).pipe(
          switchMap(() => {
            console.log(`File ${publicationFile.id} selected for publication.`);
            if (this.selectedIssueId === null) {
              // This case should ideally be caught earlier, but good for type safety in pipe
              return throwError(() => new Error('Issue must be selected for publication.'));
            }
            return this.userManuscriptService.publishArticle(manuscriptId, this.selectedIssueId, publicationFile.id);
          }),
          switchMap(() => {
            console.log('Article successfully linked to issue (Paper record created). Now updating submission status.');
            return this.userManuscriptService.updateSubmissionStatus(manuscriptId, statusToUpdate);
          })
        ).subscribe({
          next: (response) => {
            this.userToastNotificationService.showToast('Success', response.message || successMessage, 'success');
            this.manuscript.submissionStatus = response.data?.submissionStatus || statusToUpdate;
            this.closeModal('publicationConfirmationModal');
            // Update the publication status in the local manuscript object for immediate UI reflection
            if (this.manuscript.publication) {
              this.manuscript.publication.status = statusToUpdate;
              this.manuscript.publication.date = new Date(); // Set current date as publication date
              const selectedIssue = this.issues.find(issue => issue.id === this.selectedIssueId);
              if (selectedIssue) {
                this.manuscript.publication.volumeIssue = `Vol ${selectedIssue.volumeNumber}, No ${selectedIssue.issueNumber}`;
              }
            }
          },
          error: (err) => {
            console.error('Publication action error:', err);
            const errorMessage = err.message || err.error?.message || 'Failed to complete action.';
            this.userToastNotificationService.showToast('Error', errorMessage, 'danger');
          }
        });
        break;

      case 'unpublishArticle':
        statusToUpdate = 'PUBLICATION';
        successMessage = 'Article unpublished successfully!';

        // Chain the calls: Delete paper record -> Update submission status
        this.userManuscriptService.unpublishArticle(manuscriptId).pipe(
          switchMap(() => {
            console.log('Paper record deleted from apjs_paper. Now updating submission status.');
            return this.userManuscriptService.updateSubmissionStatus(manuscriptId, statusToUpdate);
          })
        ).subscribe({
          next: (response) => {
            this.userToastNotificationService.showToast('Success', response.message || successMessage, 'success');
            this.manuscript.submissionStatus = response.data?.submissionStatus || statusToUpdate;
            this.closeModal('publicationConfirmationModal');
            // Update the publication status in the local manuscript object
            if (this.manuscript.publication) {
              this.manuscript.publication.status = statusToUpdate;
              this.manuscript.publication.date = null; // Clear publication date if unpublished
              this.manuscript.publication.volumeIssue = ''; // Clear volume/issue
            }
          },
          error: (err) => {
            console.error('Unpublication action error:', err);
            const errorMessage = err.message || err.error?.message || 'Failed to complete action.';
            this.userToastNotificationService.showToast('Error', errorMessage, 'danger');
          }
        });
        break;

      default:
        this.userToastNotificationService.showToast('Error', 'Invalid action.', 'danger');
        return;
    }
  }

  // This method is now less critical as actions are handled directly in confirmPublicationAction
  // Keeping it for generic status updates if needed elsewhere, but unpublish/publish
  // actions will use the chained observables.
  updatePublicationStatus(manuscriptId: number, status: string, successMessage: string): void {
    this.userManuscriptService.updateSubmissionStatus(manuscriptId, status).subscribe({
      next: (response) => {
        this.userToastNotificationService.showToast('Success', response.message || successMessage, 'success');
        this.manuscript.submissionStatus = response.data?.submissionStatus || status;
        this.closeModal('publicationConfirmationModal');
        if (this.manuscript.publication) {
          this.manuscript.publication.status = status;
          if (status === 'PUBLICATION') {
            this.manuscript.publication.date = null;
            this.manuscript.publication.volumeIssue = '';
          }
        }
      },
      error: (err) => {
        console.error('Publication action error:', err);
        const errorMessage = err.error?.message || err.statusText || 'Server error during status update.';
        this.userToastNotificationService.showToast('Error', errorMessage, 'danger');
      }
    });
  }

  openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const bootstrapModal = new bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const bootstrapModal = bootstrap.Modal.getInstance(modalElement);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }
}