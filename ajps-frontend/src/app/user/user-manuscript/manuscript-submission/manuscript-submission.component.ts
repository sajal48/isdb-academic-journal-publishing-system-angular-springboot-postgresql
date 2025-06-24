import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
// Ensure these imports are correct and Discussion interface has createdAt: Date; and origin: DiscussionOrigin;
import { Discussion, Manuscript } from '../user-manuscript.component';
import { UserManuscriptService } from '../../../site-settings/manuscript/user-manuscript.service';
import { AuthLoginRegisterService } from '../../../site-settings/auth/auth-login-register.service';
import { HttpClient } from '@angular/common/http';
import { UserToastNotificationService } from '../../../site-settings/toast-popup/user-toast-notification.service';

declare var bootstrap: any;

// Define the TypeScript equivalent of your Java enum if it's not in a shared file
// Ensure this matches your Java enum values exactly
export enum DiscussionOrigin {
  PRE_REVIEW = 'PRE_REVIEW',
  IN_REVIEW = 'IN_REVIEW',
  POST_REVIEW = 'POST_REVIEW',
  EDITORIAL = 'EDITORIAL',
  AUTHOR_QUERY = 'AUTHOR_QUERY',
  TECHNICAL_SUPPORT = 'TECHNICAL_SUPPORT',
}

@Component({
  selector: 'app-manuscript-submission',
  imports: [CommonModule, FormsModule],
  templateUrl: './manuscript-submission.component.html',
  styleUrl: './manuscript-submission.component.css',
  standalone: true
})
export class ManuscriptSubmissionComponent implements OnInit {
  manuscript!: Manuscript;
  newDiscussionTitle: string = '';
  newDiscussionMessage: string = '';
  newDiscussionOrigin: DiscussionOrigin | null = null; // Property to hold the selected origin from dropdown
  selectedFile: File | null = null;
  assignedParticipantName: string = '';

  selectedDiscussion: Discussion | null = null;

  currentUserId: number = 0;

  // Expose the enum to the template for dropdown options
  DiscussionOrigin = DiscussionOrigin;

  constructor(
    private route: ActivatedRoute,
    private manuscriptService: UserManuscriptService,
    private authLoginRegisterService: AuthLoginRegisterService,
    private http: HttpClient,
    private userToastNotificationService: UserToastNotificationService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authLoginRegisterService.getUserID();

    this.route.parent?.paramMap.pipe(
      switchMap(params => {
        const manuscriptId = params.get('manuscriptId');
        if (manuscriptId && this.currentUserId) {
          // Fetch manuscript details
          return this.manuscriptService.getManuscriptById(this.currentUserId, manuscriptId);
        }
        return of(undefined);
      })
    ).subscribe(manuscript => {
      if (manuscript) {
        this.manuscript = manuscript;
        console.log('Manuscript loaded for submission:', this.manuscript);
        // Load discussions immediately after manuscript is loaded
        this.loadDiscussions(Number(this.manuscript.id));
      } else {
        console.error('Manuscript not found for submission component or ID/User ID missing.');
      }
    });
  }

  // New method to load discussions
  loadDiscussions(submissionId: number): void {
    this.manuscriptService.getDiscussionsForSubmission(submissionId).subscribe({
      next: (discussions) => {
        this.manuscript.discussions = discussions;
        console.log('Discussions loaded:', this.manuscript.discussions);
      },
      error: (err) => {
        console.error('Error loading discussions:', err);
        this.userToastNotificationService.showToast('Error', 'Failed to load discussions.', 'danger');
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadFile(): void {
    if (this.selectedFile && this.manuscript && this.manuscript.id) {
      this.manuscriptService.uploadManuscriptFile(Number(this.manuscript.id), this.selectedFile).subscribe(
        response => {
          if (response && response.code === 200 && response.data) {
            console.log('File uploaded successfully:', response.data);
            this.userToastNotificationService.showToast('Success', 'File uploaded successfully!', 'success'); // Use toast notification
            if (!this.manuscript.files) {
              this.manuscript.files = [];
            }
            this.manuscript.files.push({
              id: response.data.id,
              name: response.data.originalName,
              url: response.data.fileUrl,
              size: (response.data.size / 1024).toFixed(2),
              storedName: response.data.storedName
            });
            this.selectedFile = null;
            const uploadModal = bootstrap.Modal.getInstance(document.getElementById('uploadFileModal'));
            if (uploadModal) {
              uploadModal.hide();
            }
          } else {
            console.error('Upload response not as expected:', response);
            this.userToastNotificationService.showToast('Error', 'File upload failed: Unexpected response from server.', 'danger');
          }
        },
        error => {
          console.error('File upload error:', error);
          this.userToastNotificationService.showToast('Error', 'File upload failed: ' + (error.error?.message || 'Server error.'), 'danger');
        }
      );
    } else {
      this.userToastNotificationService.showToast('Warning', 'No file selected or manuscript ID is missing.', 'warning');
    }
  }

  /*deleteFile(fileId: number, fileName: string): void {
    // Replaced confirm() with a custom message using toast for better UX, as per guidelines.
    // If you need a full confirmation dialog, you would implement a custom modal.
    this.userToastNotificationService.showToast(
      'Confirm Deletion',
      `Are you sure you want to delete the file "${fileName}"? This action cannot be undone.`,
      'warning',
      true, // Make it dismissible manually
      () => { // Callback for 'Yes' equivalent
        if (this.manuscript && this.manuscript.id) {
          this.manuscriptService.deleteManuscriptFile(Number(this.manuscript.id), fileId).subscribe(
            response => {
              if (response && response.code === 200) {
                console.log('File deleted successfully:', response.message);
                this.userToastNotificationService.showToast('Success', 'File deleted successfully!', 'success');
                if (this.manuscript.files) {
                  this.manuscript.files = this.manuscript.files.filter(f => f.id !== fileId);
                }
              } else {
                console.error('Delete response not as expected:', response);
                this.userToastNotificationService.showToast('Error', 'File deletion failed: Unexpected response from server.', 'danger');
              }
            },
            error => {
              console.error('File deletion error:', error);
              this.userToastNotificationService.showToast('Error', 'File deletion failed: ' + (error.error?.message || 'Server error.'), 'danger');
            }
          );
        } else {
          this.userToastNotificationService.showToast('Warning', 'Manuscript ID is missing. Cannot delete file.', 'warning');
        }
      }
    );
  }*/

  downloadFile(fileUrl: string, originalFileName: string): void {
    const downloadUrl = fileUrl;

    this.http.get(downloadUrl, { responseType: 'blob' })
      .subscribe({
        next: (response: Blob) => {
          const blob = new Blob([response], { type: response.type });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = originalFileName;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error: any) => {
          this.userToastNotificationService.showToast('Error', 'Failed to download file. Please try again.', 'danger');
        }
      });
  }

  addDiscussion(): void {
    this.newDiscussionTitle = '';
    this.newDiscussionMessage = '';
    this.newDiscussionOrigin = null; // Reset origin when opening the modal
    const discussionModal = new bootstrap.Modal(document.getElementById('addDiscussionModal'));
    discussionModal.show();
  }

  confirmAddDiscussion(): void {
    // Added validation for newDiscussionOrigin
    if (this.newDiscussionTitle && this.newDiscussionMessage && this.manuscript && this.manuscript.id) {
      this.manuscriptService.createDiscussion(
        Number(this.manuscript.id),
        this.currentUserId,
        this.newDiscussionTitle,
        this.newDiscussionMessage,
        this.newDiscussionOrigin = DiscussionOrigin.PRE_REVIEW // Pass the selected origin directly
      ).subscribe({
        next: (newDisc) => {
          console.log('New discussion added:', newDisc);
          this.userToastNotificationService.showToast('Success', 'Discussion added successfully!', 'success');

          // Reload discussions to get the latest list, including the new one
          this.loadDiscussions(Number(this.manuscript.id));

          const discussionModal = bootstrap.Modal.getInstance(document.getElementById('addDiscussionModal'));
          if (discussionModal) {
            discussionModal.hide();
          }
          this.newDiscussionTitle = ''; // Clear input fields
          this.newDiscussionMessage = '';
          this.newDiscussionOrigin = null; // Clear origin
        },
        error: (err) => {
          console.error('Error adding discussion:', err);
          this.userToastNotificationService.showToast('Error', 'Failed to add discussion: ' + (err.error?.message || 'Server error.'), 'danger');
        }
      });
    } else {
      this.userToastNotificationService.showToast('Warning', 'Please provide a title, message, and select an origin. Also, ensure manuscript ID is available.', 'warning');
    }
  }

  viewDiscussionContent(discussion: Discussion): void {
    this.selectedDiscussion = discussion;
    const detailModal = new bootstrap.Modal(document.getElementById('discussionContentModal'));
    detailModal.show();
  }

  openConfirmationModal(action: string): void {
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
      const modalTitle = modalElement.querySelector('.modal-title');
      const modalBody = modalElement.querySelector('.modal-body');
      const confirmButton = modalElement.querySelector('#confirmActionButton') as HTMLButtonElement;

      if (modalTitle && modalBody && confirmButton) {
        let titleText = '';
        let bodyText = '';
        let buttonAction: () => void;

        switch (action) {
          case 'sendToReview':
            titleText = 'Confirm Send to Review';
            bodyText = 'Are you sure you want to send this manuscript to review? This action cannot be undone.';
            buttonAction = () => this._sendToReview();
            break;
          case 'acceptAndSkipReview':
            titleText = 'Confirm Accept and Skip Review';
            bodyText = 'Are you sure you want to accept this manuscript and skip the review process?';
            buttonAction = () => this._acceptAndSkipReview();
            break;
          case 'declineSubmission':
            titleText = 'Confirm Decline Submission';
            bodyText = 'Are you sure you want to decline this manuscript submission? This action is irreversible.';
            buttonAction = () => this._declineSubmission();
            break;
          default:
            return;
        }

        modalTitle.textContent = titleText;
        modalBody.textContent = bodyText;
        confirmButton.onclick = () => {
          buttonAction();
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        };

        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }
  }

  private _sendToReview(): void {
    if (this.manuscript && this.manuscript.id) {
      this.manuscriptService.updateSubmissionStatus(Number(this.manuscript.id), 'ACCEPTED').subscribe({
        next: (response) => {
          this.userToastNotificationService.showToast('Success', 'Manuscript successfully sent to review!', 'success');
          // Update local status after successful backend update
          if (this.manuscript.status) {
            this.manuscript.status.submission = 'Sent to Review';
            this.manuscript.status.review = 'In Progress'; // Or 'Pending Assignment'
          }
        },
        error: (err) => {
          console.error('Error sending to review:', err);
          this.userToastNotificationService.showToast('Error', 'Failed to send to review: ' + (err.error?.message || 'Server error.'), 'danger');
        }
      });
    } else {
      this.userToastNotificationService.showToast('Warning', 'Manuscript ID is missing. Cannot send to review.', 'warning');
    }
  }

  private _acceptAndSkipReview(): void {
    if (this.manuscript && this.manuscript.id) {
      this.manuscriptService.updateSubmissionStatus(Number(this.manuscript.id), 'UNDER_REVIEW').subscribe({
        next: (response) => {
          this.userToastNotificationService.showToast('Success', 'Manuscript accepted and review skipped!', 'success');
          // Update local status after successful backend update
          if (this.manuscript.status) {
            this.manuscript.status.submission = 'Accepted';
            this.manuscript.status.review = 'Skipped';
            this.manuscript.status.copyEditing = 'In Progress'; // Transition to copy editing
          }          
            document.location.reload();
        },
        error: (err) => {
          console.error('Error accepting and skipping review:', err);
          this.userToastNotificationService.showToast('Error', 'Failed to accept and skip review: ' + (err.error?.message || 'Server error.'), 'danger');
        }
      });
    } else {
      this.userToastNotificationService.showToast('Warning', 'Manuscript ID is missing. Cannot accept and skip review.', 'warning');
    }
  }

  private _declineSubmission(): void {
    if (this.manuscript && this.manuscript.id) {
      this.manuscriptService.updateSubmissionStatus(Number(this.manuscript.id), 'REJECTED').subscribe({
        next: (response) => {
          this.userToastNotificationService.showToast('Success', 'Manuscript submission successfully declined!', 'success');
          // Update local status after successful backend update
          if (this.manuscript.status) {
            this.manuscript.status.submission = 'Declined';
            this.manuscript.status.review = 'N/A';
            this.manuscript.status.copyEditing = 'N/A';
            this.manuscript.status.production = 'N/A';
            this.manuscript.status.publication = 'N/A';
          }
            document.location.reload();
        },
        error: (err) => {
          console.error('Error declining submission:', err);
          this.userToastNotificationService.showToast('Error', 'Failed to decline submission.', 'danger');
        }
      });
    } else {
      this.userToastNotificationService.showToast('Warning', 'Manuscript ID is missing. Cannot decline submission.', 'warning');
    }
  }

  assignParticipant(): void {
    this.assignedParticipantName = '';
    const assignModal = new bootstrap.Modal(document.getElementById('assignParticipantModal'));
    assignModal.show();
  }

  confirmAssignParticipant(): void {
    if (this.assignedParticipantName) {
      this.userToastNotificationService.showToast('Success', `Participant '${this.assignedParticipantName}' assigned!`, 'success');
      console.log('Assigning participant:', this.assignedParticipantName);
      const assignModal = bootstrap.Modal.getInstance(document.getElementById('assignParticipantModal'));
      if (assignModal) {
        assignModal.hide();
      }
    } else {
      this.userToastNotificationService.showToast('Warning', 'Please enter a participant name.', 'warning');
    }
  }
}
