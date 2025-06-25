import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Discussion, DiscussionOrigin, Manuscript, SubmissionFile } from '../user-manuscript.component';
import { UserManuscriptService } from '../../../site-settings/manuscript/user-manuscript.service';
import { AuthLoginRegisterService } from '../../../site-settings/auth/auth-login-register.service';
import { UserToastNotificationService } from '../../../site-settings/toast-popup/user-toast-notification.service';

declare var bootstrap: any;

@Component({
  selector: 'app-manuscript-production',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './manuscript-production.component.html',
  styleUrls: ['./manuscript-production.component.css'],
  standalone: true
})
export class ManuscriptProductionComponent implements OnInit {
  manuscript!: Manuscript;
  currentUserId: number = 0;

  copyEditedFiles: SubmissionFile[] = [];
  productionReadyFiles: SubmissionFile[] = [];
  productionDiscussions: Discussion[] = [];

  selectedProductionFile: File | null = null;
  newProductionDiscussionTitle: string = '';
  newProductionDiscussionMessage: string = '';
  selectedDiscussion: Discussion | null = null;

  confirmationMessage: string = '';
  currentAction: string = '';

  private discussionOrigin: DiscussionOrigin = DiscussionOrigin.COPY_EDIT;
  selectedPublicationFileId: number | null = null;

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
        console.log('Manuscript loaded for production:', this.manuscript);
        this.filterFilesAndDiscussions();
        this.loadDiscussions(Number(this.manuscript.id));
      } else {
        console.error('Manuscript not found.');
        this.userToastNotificationService.showToast('Error', 'Manuscript not found.', 'danger');
        this.router.navigate(['/user/dashboard']);
      }
    });
  }

  filterFilesAndDiscussions(): void {
    if (this.manuscript) {
      // Copy edited files are those marked as isCopyEditingFile or with COPY_EDIT origin
      this.copyEditedFiles = this.manuscript.files?.filter(file => file.isCopyEditingFile) || [];
      
      // Production ready files are those marked as isProductionFile or with PRODUCTION origin
      this.productionReadyFiles = this.manuscript.files?.filter(file => 
        file.isProductionFile || file.fileOrigin === 'PRODUCTION') || [];
      
      this.productionDiscussions = this.manuscript.discussions?.filter(discussion => 
        discussion.origin === DiscussionOrigin.PRODUCTION) || [];
    }
  }

  loadDiscussions(submissionId: number): void {
    this.userManuscriptService.getDiscussionsForSubmission(submissionId).subscribe({
      next: (discussions) => {
        this.manuscript.discussions = discussions;
        this.productionDiscussions = discussions.filter(d => d.origin === DiscussionOrigin.PRODUCTION);
        console.log('Production discussions loaded:', this.productionDiscussions);
      },
      error: (err) => {
        console.error('Error loading discussions:', err);
        this.userToastNotificationService.showToast('Error', 'Failed to load discussions.', 'danger');
      }
    });
  }

  downloadFile(url: string, fileName: string): void {
    // this.userToastNotificationService.showToast('Info', `Downloading: ${fileName}...`, 'info');
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

  onProductionFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedProductionFile = file || null;
  }

  uploadProductionFile(): void {
    if (this.selectedProductionFile && this.manuscript?.id) {
      this.userManuscriptService.uploadProductionFile(Number(this.manuscript.id), this.selectedProductionFile).subscribe({
        next: (response) => {
          if (response?.code === 200 && response.data) {
            const newFile = {
              id: response.data.id,
              name: response.data.originalName,
              url: response.data.fileUrl,
              size: response.data.size,
              storedName: response.data.storedName,
              isReviewFile: response.data.isReviewFile,
              isCopyEditingFile: response.data.isCopyEditingFile,
              isProductionFile: response.data.isProductionFile,
              fileOrigin: response.data.fileOrigin
            };
            if (!this.manuscript.files) this.manuscript.files = [];
            this.manuscript.files.push(newFile);
            this.filterFilesAndDiscussions();
            this.selectedProductionFile = null;
            this.closeModal('uploadProductionFileModal');
            this.userToastNotificationService.showToast('Success', 'Production file uploaded successfully!', 'success');
          } else {
            this.userToastNotificationService.showToast('Error', 'Unexpected server response.', 'danger');
          }
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.userToastNotificationService.showToast('Error', error.error?.message || 'Upload failed.', 'danger');
        }
      });
    } else {
      this.userToastNotificationService.showToast('Warning', 'No file selected or manuscript ID missing.', 'warning');
    }
  }

  markAsFinalVersion(file: SubmissionFile): void {
    if (!this.manuscript?.id) return;

    // this.userToastNotificationService.showToast('Info', 'Marking file as final version...', 'info');
    
    this.userManuscriptService.selectFileForProduction(Number(this.manuscript.id), file.id).subscribe({
      next: (response) => {
        if (response?.code === 200) {
          // Update local file status
          if (this.manuscript.files) {
            this.manuscript.files.forEach(f => {
              f.isProductionFile = (f.id === file.id);
            });
          }
          this.filterFilesAndDiscussions();
          this.userToastNotificationService.showToast('Success', 'File marked as final version!', 'success');
        } else {
          this.userToastNotificationService.showToast('Error', 'Failed to mark file as final version.', 'danger');
        }
      },
      error: (error) => {
        console.error('Error marking file as final:', error);
        this.userToastNotificationService.showToast('Error', error.error?.message || 'Failed to mark file as final version.', 'danger');
      }
    });
  }

  addProductionDiscussion(): void {
    this.newProductionDiscussionTitle = '';
    this.newProductionDiscussionMessage = '';
    this.openModal('addProductionDiscussionModal');
  }

  confirmAddProductionDiscussion(): void {
    if (this.newProductionDiscussionTitle && this.newProductionDiscussionMessage && this.manuscript?.id) {
      this.userManuscriptService.createDiscussion(
        Number(this.manuscript.id),
        this.currentUserId,
        this.newProductionDiscussionTitle,
        this.newProductionDiscussionMessage,
        this.discussionOrigin = DiscussionOrigin.PRODUCTION
      ).subscribe({
        next: (newDisc) => {
          if (!this.manuscript.discussions) this.manuscript.discussions = [];
          this.manuscript.discussions.push(newDisc);
          this.filterFilesAndDiscussions();
          this.closeModal('addProductionDiscussionModal');
          this.newProductionDiscussionTitle = '';
          this.newProductionDiscussionMessage = '';
          this.userToastNotificationService.showToast('Success', 'Discussion added!', 'success');
        },
        error: (err) => {
          console.error('Discussion error:', err);
          this.userToastNotificationService.showToast('Error', err.error?.message || 'Failed to add discussion.', 'danger');
        }
      });
    } else {
      this.userToastNotificationService.showToast('Warning', 'Fill all discussion fields.', 'warning');
    }
  }

  viewDiscussionContent(discussion: Discussion): void {
    this.selectedDiscussion = discussion;
    this.openModal('discussionContentModal');
  }

  // Modify the existing openProductionActionModal method
openProductionActionModal(action: string): void {
    this.currentAction = action;
    switch (action) {
        case 'scheduleForPublication':
            this.openSelectPublicationFileModal();
            return;
        case 'declineSubmission':
            this.confirmationMessage = 'Are you sure you want to decline this submission?';
            break;
        default:
            this.confirmationMessage = 'Are you sure you want to proceed?';
    }
    this.openModal('productionConfirmationModal');
}

  confirmProductionAction(): void {
    if (!this.manuscript?.id) {
      this.userToastNotificationService.showToast('Error', 'Manuscript ID missing.', 'danger');
      return;
    }

    const manuscriptId = Number(this.manuscript.id);
    let statusToUpdate = '';
    let successMessage = '';
    let navigateToRoute: string | null = null;

    switch (this.currentAction) {
      case 'scheduleForPublication':
        statusToUpdate = 'PUBLICATION';
        successMessage = 'Manuscript scheduled for publication!';
        navigateToRoute = `/user/manuscript/${manuscriptId}/publication`;
        break;
      case 'declineSubmission':
        statusToUpdate = 'REJECTED';
        successMessage = 'Submission declined.';
        navigateToRoute = `/user/manuscript/${manuscriptId}/submission`;
        break;
      default:
        this.userToastNotificationService.showToast('Error', 'Invalid action.', 'danger');
        return;
    }

    this.userManuscriptService.updateSubmissionStatus(manuscriptId, statusToUpdate).subscribe({
      next: (response) => {
        this.userToastNotificationService.showToast('Success', response.message || successMessage, 'success');
        this.manuscript.submissionStatus = response.data?.submissionStatus || statusToUpdate;
        this.closeModal('productionConfirmationModal');
        // this.router.navigate([`/user/manuscript/${this.manuscript.id}/publication`]);
        if (navigateToRoute) {
            this.router.navigate([navigateToRoute]);
          }
      },
      error: (err) => {
        console.error('Production action error:', err);
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

  // Add this method to open the file selection modal
openSelectPublicationFileModal(): void {
    this.selectedPublicationFileId = null; // Reset selection
    this.openModal('selectPublicationFileModal');
}

// Add this method to handle the confirmation with file selection
confirmScheduleForPublication(): void {
    if (!this.manuscript?.id || this.selectedPublicationFileId === null) {
        this.userToastNotificationService.showToast('Error', 'Manuscript ID or selected file missing.', 'danger');
        return;
    }

    const manuscriptId = Number(this.manuscript.id);
    const fileIdForPublication = this.selectedPublicationFileId;

    // this.userToastNotificationService.showToast('Info', 'Scheduling manuscript for publication...', 'info');

    // Make two API calls: one to update status and another to select the publication file
    forkJoin([
        this.userManuscriptService.updateSubmissionStatus(manuscriptId, 'PUBLICATION'),
        this.userManuscriptService.selectFileForPublication(manuscriptId, fileIdForPublication)
    ]).subscribe({
        next: ([statusResponse, fileSelectionResponse]) => {
            // Update local manuscript status
            this.manuscript.submissionStatus = statusResponse.data?.submissionStatus || 'PUBLICATION';
            
            // Update local file data to reflect the publication file status
            if (this.manuscript.files) {
                this.manuscript.files.forEach(file => {
                    file.isPublicationFile = (file.id === fileIdForPublication);
                });
            }

            this.userToastNotificationService.showToast('Success', 'Manuscript scheduled for publication!', 'success');
            this.closeModal('selectPublicationFileModal');
            this.selectedPublicationFileId = null;
            this.router.navigate([`/user/manuscript/${this.manuscript.id}/publication`]);
        },
        error: (error) => {
            console.error('Error during publication scheduling:', error);
            this.userToastNotificationService.showToast('Error', error.error?.message || 'Failed to schedule for publication.', 'danger');
        }
    });
}


}