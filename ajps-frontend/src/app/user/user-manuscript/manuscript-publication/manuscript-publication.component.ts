import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Discussion, DiscussionOrigin, Manuscript, SubmissionFile } from '../user-manuscript.component';
import { Journal, JournalIssue, UserManuscriptService } from '../../../site-settings/manuscript/user-manuscript.service'; // Import Journal and JournalIssue interfaces
import { AuthLoginRegisterService } from '../../../site-settings/auth/auth-login-register.service';
import { UserToastNotificationService } from '../../../site-settings/toast-popup/user-toast-notification.service';

declare var bootstrap: any;

interface JournalIssueDisplay { // Renamed to avoid conflict with imported JournalIssue
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
  issues: JournalIssueDisplay[] = []; // Using the renamed interface
  selectedIssueId: number | null = null;

  // For Modals
  confirmationMessage: string = '';
  currentAction: string = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private userManuscriptService: UserManuscriptService,
    private authLoginRegisterService: AuthLoginRegisterService,
    private userToastNotificationService: UserToastNotificationService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authLoginRegisterService.getUserID();
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
        this.loadIssues(); // Call loadIssues after manuscript is loaded
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
          // Filter for issues that are 'Future' or 'Published' (if you want to allow changing published status)
          // For publication, typically you'd select a future or current unassigned issue.
          this.issues = currentJournal.issues
            .filter(issue => issue.status === 'Future' || issue.status === 'Published') // Adjust filtering as needed
            .map(issue => ({
              id: issue.id,
              journalName: currentJournal.journalName,
              volumeNumber: issue.volume,
              issueNumber: issue.number,
              year: new Date(issue.publicationDate).getFullYear() // Extract year from publicationDate
            }));
          console.log('Loaded issues:', this.issues);
          // Pre-select an issue if the manuscript already has one assigned (if your manuscript model supports this)
          // this.selectedIssueId = this.manuscript.publication?.issueId || null; // Example if your manuscript had an issueId
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
        if (!this.selectedIssueId) {
          this.userToastNotificationService.showToast('Error', 'Please select an issue for publication.', 'danger');
          return;
        }
        statusToUpdate = 'PUBLISHED'; // Changed from 'PUBLICATION' to 'PUBLISHED' as per common status names
        successMessage = 'Article published successfully!';
        break;
      case 'unpublishArticle':
        statusToUpdate = 'UNPUBLISHED';
        successMessage = 'Article unpublished successfully!';
        break;
      default:
        this.userToastNotificationService.showToast('Error', 'Invalid action.', 'danger');
        return;
    }

    // For publishing, we need to assign the issue first
    if (this.currentAction === 'publishArticle' && this.selectedIssueId) {
      // First, select the publication file (assuming there's one, or select the latest if multiple)
      // For simplicity, let's assume the first publication file found is the one to be used.
      const publicationFile = this.publicationFiles[0];
      if (!publicationFile) {
        this.userToastNotificationService.showToast('Error', 'No publication file found to assign.', 'danger');
        return;
      }
      this.userManuscriptService.selectFileForPublication(manuscriptId, publicationFile.id).pipe(
        switchMap(() => {
          console.log(`File ${publicationFile.id} selected for publication.`);
          // After selecting the file, update the submission status to PUBLISHED
          return this.userManuscriptService.updateSubmissionStatus(manuscriptId, statusToUpdate);
        })
      ).subscribe({
        next: (response) => {
          this.userToastNotificationService.showToast('Success', response.message || successMessage, 'success');
          this.manuscript.submissionStatus = response.data?.submissionStatus || statusToUpdate;
          this.closeModal('publicationConfirmationModal');
          // Optionally, update the manuscript's publication details in the component
          if (this.manuscript.publication) {
            this.manuscript.publication.status = statusToUpdate;
            this.manuscript.publication.date = new Date(); // Set current date
            const selectedIssue = this.issues.find(issue => issue.id === this.selectedIssueId);
            if (selectedIssue) {
              this.manuscript.publication.volumeIssue = `Vol ${selectedIssue.volumeNumber}, No ${selectedIssue.issueNumber}`;
            }
          }
        },
        error: (err) => {
          console.error('Publication action error:', err);
          this.userToastNotificationService.showToast('Error', err.error?.message || 'Failed to complete action.', 'danger');
        }
      });
    } else {
      this.updatePublicationStatus(manuscriptId, statusToUpdate, successMessage);
    }
  }

  updatePublicationStatus(manuscriptId: number, status: string, successMessage: string): void {
    this.userManuscriptService.updateSubmissionStatus(manuscriptId, status).subscribe({
      next: (response) => {
        this.userToastNotificationService.showToast('Success', response.message || successMessage, 'success');
        this.manuscript.submissionStatus = response.data?.submissionStatus || status;
        this.closeModal('publicationConfirmationModal');
        // Update the publication status in the local manuscript object
        if (this.manuscript.publication) {
          this.manuscript.publication.status = status;
          if (status === 'UNPUBLISHED') {
            this.manuscript.publication.date = null; // Clear publication date if unpublished
            this.manuscript.publication.volumeIssue = ''; // Clear volume/issue
          }
        }
      },
      error: (err) => {
        console.error('Publication action error:', err);
        this.userToastNotificationService.showToast('Error', err.error?.message || 'Failed to complete action.', 'danger');
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