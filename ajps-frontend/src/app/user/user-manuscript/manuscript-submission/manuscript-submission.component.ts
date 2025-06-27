// Imports remain unchanged
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Discussion, DiscussionOrigin, Manuscript, SubmissionFile } from '../user-manuscript.component';
import { UserManuscriptService } from '../../../site-settings/manuscript/user-manuscript.service';
import { AuthLoginRegisterService } from '../../../site-settings/auth/auth-login-register.service';
import { HttpClient } from '@angular/common/http';
import { UserToastNotificationService } from '../../../site-settings/toast-popup/user-toast-notification.service';

declare var bootstrap: any;

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
  newDiscussionOrigin: DiscussionOrigin | null = null;
  selectedFile: File | null = null;
  assignedParticipantName: string = '';
  selectedDiscussion: Discussion | null = null;
  currentUserId: number = 0;
  currentUserRole: string = '';
  selectedFileForReviewId: number | null = null;
  filesForReview: SubmissionFile[] = [];
  selectedFileForCopyEditingId: number | null = null;
  filesForCopyEditing: SubmissionFile[] = [];
  DiscussionOrigin = DiscussionOrigin;

  constructor(
    private route: ActivatedRoute,
    private manuscriptService: UserManuscriptService,
    private authLoginRegisterService: AuthLoginRegisterService,
    private http: HttpClient,
    private userToastNotificationService: UserToastNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.authLoginRegisterService.getUserRole();
    this.currentUserId = this.authLoginRegisterService.getUserID();
    this.route.parent?.paramMap.pipe(
      switchMap(params => {
        const manuscriptId = params.get('manuscriptId');
        if (manuscriptId && this.currentUserId) {
          return this.manuscriptService.getManuscriptById(this.currentUserId, manuscriptId);
        }
        return of(undefined);
      })
    ).subscribe(manuscript => {
      if (manuscript) {
        this.manuscript = manuscript;
        console.log('Manuscript loaded for submission:', this.manuscript);
        this.loadDiscussions(Number(this.manuscript.id));
        this.manuscript.files = manuscript.files?.filter(file => file.fileOrigin === 'SUBMISSION' || file.fileOrigin === 'PRE_REVIEW');
      } else {
        console.error('Manuscript not found for submission component or ID/User ID missing.');
      }
    });
  }

  loadDiscussions(submissionId: number): void {
    this.manuscriptService.getDiscussionsForSubmission(submissionId).subscribe({
      next: (discussions) => {
        this.manuscript.discussions = discussions.filter(d => d.origin === DiscussionOrigin.PRE_REVIEW);
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
    if (this.selectedFile && this.manuscript?.id) {
      this.manuscriptService.uploadManuscriptFile(Number(this.manuscript.id), this.selectedFile).subscribe({
        next: (response) => {
          if (response?.code === 200 && response.data) {
            this.userToastNotificationService.showToast('Success', 'File uploaded successfully!', 'success');
            if (!this.manuscript.files) {
              this.manuscript.files = [];
            }
            this.manuscript.files.push({
              id: response.data.id,
              name: response.data.originalName,
              url: response.data.fileUrl,
              size: (response.data.size / 1024).toFixed(2),
              storedName: response.data.storedName,
              fileOrigin: 'PRE_REVIEW',
              isReviewFile: false,
              isCopyEditingFile: false
            });
            this.selectedFile = null;
            const modal = bootstrap.Modal.getInstance(document.getElementById('uploadFileModal'));
            if (modal) modal.hide();
          } else {
            this.userToastNotificationService.showToast('Error', 'Unexpected upload response.', 'danger');
          }
        },
        error: (error) => {
          this.userToastNotificationService.showToast('Error', error.error?.message || 'Upload failed.', 'danger');
        }
      });
    } else {
      this.userToastNotificationService.showToast('Warning', 'Select a file before uploading.', 'warning');
    }
  }

  downloadFile(fileUrl: string, originalFileName: string): void {
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe({
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
      error: () => {
        this.userToastNotificationService.showToast('Error', 'Failed to download file.', 'danger');
      }
    });
  }

  addDiscussion(): void {
    this.newDiscussionTitle = '';
    this.newDiscussionMessage = '';
    this.newDiscussionOrigin = null;
    new bootstrap.Modal(document.getElementById('addDiscussionModal')).show();
  }

  confirmAddDiscussion(): void {
    if (this.newDiscussionTitle && this.newDiscussionMessage && this.manuscript?.id) {
      this.manuscriptService.createDiscussion(
        Number(this.manuscript.id),
        this.currentUserId,
        this.newDiscussionTitle,
        this.newDiscussionMessage,
        this.newDiscussionOrigin = DiscussionOrigin.PRE_REVIEW
      ).subscribe({
        next: (newDisc) => {
          this.userToastNotificationService.showToast('Success', 'Discussion added!', 'success');
          this.loadDiscussions(Number(this.manuscript.id));
          const modal = bootstrap.Modal.getInstance(document.getElementById('addDiscussionModal'));
          if (modal) modal.hide();
        },
        error: (err) => {
          this.userToastNotificationService.showToast('Error', err.error?.message || 'Failed to add discussion.', 'danger');
        }
      });
    } else {
      this.userToastNotificationService.showToast('Warning', 'Fill all fields for discussion.', 'warning');
    }
  }

  viewDiscussionContent(discussion: Discussion): void {
    this.selectedDiscussion = discussion;
    new bootstrap.Modal(document.getElementById('discussionContentModal')).show();
  }

  openConfirmationModal(action: string): void {
    const modalElement = document.getElementById('confirmationModal');
    if (!modalElement) return;

    const modalTitle = modalElement.querySelector('.modal-title');
    const modalBody = modalElement.querySelector('.modal-body');
    const confirmButton = modalElement.querySelector('#confirmActionButton') as HTMLButtonElement;

    let titleText = '', bodyText = '', buttonAction: () => void;

    switch (action) {
      case 'acceptAndSkipReview':
        titleText = 'Confirm Accept and Skip Review';
        bodyText = 'Are you sure you want to accept and skip review?';
        buttonAction = () => this._acceptAndSkipReview();
        break;
      case 'declineSubmission':
        titleText = 'Confirm Decline Submission';
        bodyText = 'Are you sure you want to decline this manuscript?';
        buttonAction = () => this._declineSubmission();
        break;
      default:
        return;
    }

    modalTitle!.textContent = titleText;
    modalBody!.textContent = bodyText;
    confirmButton.onclick = () => {
      buttonAction();
      bootstrap.Modal.getInstance(modalElement)?.hide();
    };

    new bootstrap.Modal(modalElement).show();
  }

  openSendToReviewModal(): void {
    if (!this.manuscript?.files?.length) {
      // this.userToastNotificationService.showToast('Info', 'No files available.', 'info');
      return;
    }
    this.selectedFileForReviewId = null;
    this.filesForReview = this.manuscript.files.filter(f => !f.isReviewFile && !f.isCopyEditingFile);
    new bootstrap.Modal(document.getElementById('sendToReviewFileModal')).show();
  }

  confirmSendToReview(): void {
    if (this.selectedFileForReviewId && this.manuscript?.id) {
      this._sendToReview(this.selectedFileForReviewId);
      bootstrap.Modal.getInstance(document.getElementById('sendToReviewFileModal'))?.hide();
    } else {
      this.userToastNotificationService.showToast('Warning', 'Select a file.', 'warning');
    }
  }

  private _sendToReview(fileId: number): void {
    this.manuscriptService.updateSubmissionStatus(Number(this.manuscript.id), 'ACCEPTED').subscribe({
      next: () => {
        this.userToastNotificationService.showToast('Success', 'Status updated.', 'success');
        if (this.manuscript.status) {
          this.manuscript.status.submission = 'Sent to Review';
          this.manuscript.status.review = 'In Progress';
        }

        this.manuscriptService.addReviewFileReference(Number(this.manuscript.id), fileId).subscribe({
          next: (fileResponse) => {
            this.userToastNotificationService.showToast('Success', fileResponse.message, 'success');
            this.router.navigate([`/user/manuscript/${this.manuscript.id}/review`]);
          },
          error: (err) => {
            this.userToastNotificationService.showToast('Error', err.error?.message || 'Review file failed.', 'danger');
          }
        });
      },
      error: (err) => {
        this.userToastNotificationService.showToast('Error', err.error?.message || 'Status update failed.', 'danger');
      }
    });
  }

  private _acceptAndSkipReview(): void {
    this.manuscriptService.acceptAndSkipReview(Number(this.manuscript.id)).subscribe({
      next: (response) => {
        this.userToastNotificationService.showToast('Success', response.message, 'success');
        this.manuscript.submissionStatus = 'COPY_EDITING';
        if (this.manuscript.status) {
          this.manuscript.status.submission = 'Accepted';
          this.manuscript.status.review = 'Skipped';
          this.manuscript.status.copyEditing = 'In Progress';
        }
      },
      error: (err) => {
        this.userToastNotificationService.showToast('Error', err.error?.message || 'Skip failed.', 'danger');
      }
    });
  }

  private _declineSubmission(): void {
    this.manuscriptService.updateSubmissionStatus(Number(this.manuscript.id), 'REJECTED').subscribe({
      next: () => {
        this.userToastNotificationService.showToast('Success', 'Submission declined.', 'success');
        if (this.manuscript.status) {
          Object.assign(this.manuscript.status, {
            submission: 'Declined', review: 'N/A',
            copyEditing: 'N/A', production: 'N/A', publication: 'N/A'
          });
        }
        document.location.reload();
      },
      error: () => {
        this.userToastNotificationService.showToast('Error', 'Decline failed.', 'danger');
      }
    });
  }

  assignParticipant(): void {
    this.assignedParticipantName = '';
    new bootstrap.Modal(document.getElementById('assignParticipantModal')).show();
  }

  confirmAssignParticipant(): void {
    if (this.assignedParticipantName) {
      this.userToastNotificationService.showToast('Success', `Participant '${this.assignedParticipantName}' assigned!`, 'success');
      bootstrap.Modal.getInstance(document.getElementById('assignParticipantModal'))?.hide();
    } else {
      this.userToastNotificationService.showToast('Warning', 'Enter participant name.', 'warning');
    }
  }

  openSelectCopyEditingFileModal(): void {
    if (!this.manuscript?.files?.length) {
      // this.userToastNotificationService.showToast('Info', 'No files available.', 'info');
      return;
    }
    this.selectedFileForCopyEditingId = null;
    this.filesForCopyEditing = this.manuscript.files.filter(f => !f.isReviewFile && !f.isCopyEditingFile);
    new bootstrap.Modal(document.getElementById('selectCopyEditingFileModal')).show();
  }

  confirmSelectCopyEditingFile(): void {
    if (this.selectedFileForCopyEditingId && this.manuscript?.id) {
      this.manuscriptService.selectFileForCopyEditing(Number(this.manuscript.id), this.selectedFileForCopyEditingId).subscribe({
        next: (fileResponse) => {
          this.userToastNotificationService.showToast('Success', fileResponse.message, 'success');
          this.manuscript.files = this.manuscript.files?.map(file => ({
            ...file,
            isCopyEditingFile: file.id === this.selectedFileForCopyEditingId,
            isReviewFile: false
          })) || [];

          this.manuscriptService.updateSubmissionStatus(Number(this.manuscript.id), 'COPY_EDITING').subscribe({
            next: (statusResponse) => {
              this.manuscript.submissionStatus = statusResponse.data?.submissionStatus || 'COPY_EDITING';
              bootstrap.Modal.getInstance(document.getElementById('selectCopyEditingFileModal'))?.hide();
              this.router.navigate([`/user/manuscript/${this.manuscript.id}/copyediting`]);
            },
            error: (err) => {
              this.userToastNotificationService.showToast('Error', err.error?.message || 'Status update failed.', 'danger');
            }
          });
        },
        error: (err) => {
          this.userToastNotificationService.showToast('Error', err.error?.message || 'File selection failed.', 'danger');
        }
      });
    } else {
      this.userToastNotificationService.showToast('Warning', 'Select a file for copy-editing.', 'warning');
    }
  }
}
