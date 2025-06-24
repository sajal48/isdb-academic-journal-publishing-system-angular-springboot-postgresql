import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe, KeyValuePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Discussion, Manuscript, SubmissionFile } from '../user-manuscript.component';
import { DiscussionOrigin } from '../manuscript-submission/manuscript-submission.component';
import { UserManuscriptService } from '../../../site-settings/manuscript/user-manuscript.service';
import { AuthLoginRegisterService } from '../../../site-settings/auth/auth-login-register.service';
import { UserToastNotificationService } from '../../../site-settings/toast-popup/user-toast-notification.service';

declare var bootstrap: any;

@Component({
  selector: 'app-manuscript-review',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './manuscript-review.component.html',
  styleUrls: ['./manuscript-review.component.css'],
  standalone: true
})
export class ManuscriptReviewComponent implements OnInit {
  manuscript!: Manuscript;
  currentUserId: number = 0;

  newReviewDiscussionOrigin: any;
  selectedRevisionFile: File | null = null;
  newReviewDiscussionTitle: string = '';
  newReviewDiscussionMessage: string = '';
  selectedDiscussion: Discussion | null = null;

  confirmationMessage: string = '';
  currentAction: string = '';

  submissionFiles: SubmissionFile[] = [];
  revisionFiles: SubmissionFile[] = [];
  reviewDiscussions: Discussion[] = [];

  DiscussionOrigin = DiscussionOrigin;

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
        console.log('Manuscript loaded:', this.manuscript);
        this.loadDiscussions(Number(this.manuscript.id)); // filter happens inside this
      } else {
        console.error('Manuscript not found.');
        this.userToastNotificationService.showToast('Error', 'Manuscript not found.', 'danger');
        this.router.navigate(['/user/dashboard']);
      }
    });
  }

  loadDiscussions(submissionId: number): void {
    this.userManuscriptService.getDiscussionsForSubmission(submissionId).subscribe({
      next: (discussions) => {
        this.manuscript.discussions = discussions;
        console.log('Discussions loaded:', this.manuscript.discussions);
        this.filterFilesAndDiscussions(); // Now that discussions are available
      },
      error: (err) => {
        console.error('Error loading discussions:', err);
        this.userToastNotificationService.showToast('Error', 'Failed to load discussions.', 'danger');
      }
    });
  }

  filterFilesAndDiscussions(): void {
    if (this.manuscript) {
      this.submissionFiles = this.manuscript.files?.filter(file =>
        file.fileOrigin === 'PRE_REVIEW' && file.isReviewFile) || [];
      this.revisionFiles = this.manuscript.files?.filter(file =>
        file.fileOrigin === 'REVISION') || [];
      this.reviewDiscussions = this.manuscript.discussions?.filter(discussion =>
        discussion.origin === DiscussionOrigin.IN_REVIEW) || [];
    } else {
      this.submissionFiles = [];
      this.revisionFiles = [];
      this.reviewDiscussions = [];
    }
  }

  downloadFile(url: string, fileName: string): void {
    this.userToastNotificationService.showToast('Info', `Downloading: ${fileName}...`, 'info');
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

  onRevisionFileSelected(event: any): void {
    const file: File = event.target.files[0];
    this.selectedRevisionFile = file || null;
  }

  uploadRevisionFile(): void {
    if (this.selectedRevisionFile && this.manuscript?.id) {
      // this.userToastNotificationService.showToast('Info', 'Uploading revision file...', 'info');
      this.userManuscriptService.uploadRevisionFile(Number(this.manuscript.id), this.selectedRevisionFile).subscribe({
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
              fileOrigin: response.data.fileOrigin
            };
            if (!this.manuscript.files) this.manuscript.files = [];
            this.manuscript.files.push(newFile);
            this.filterFilesAndDiscussions();
            this.selectedRevisionFile = null;
            this.closeModal('uploadRevisionFileModal');
            this.userToastNotificationService.showToast('Success', 'Revision file uploaded successfully!', 'success');
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

  addReviewDiscussion(): void {
    this.newReviewDiscussionTitle = '';
    this.newReviewDiscussionMessage = '';
    this.newReviewDiscussionOrigin = DiscussionOrigin.IN_REVIEW;
    this.openModal('addReviewDiscussionModal');
  }

  confirmAddReviewDiscussion(): void {
    if (this.newReviewDiscussionTitle && this.newReviewDiscussionMessage && this.manuscript?.id && this.newReviewDiscussionOrigin) {
      // this.userToastNotificationService.showToast('Info', 'Adding discussion...', 'info');
      this.userManuscriptService.createDiscussion(
        Number(this.manuscript.id),
        this.currentUserId,
        this.newReviewDiscussionTitle,
        this.newReviewDiscussionMessage,
        this.newReviewDiscussionOrigin
      ).subscribe({
        next: (newDisc) => {
          if (!this.manuscript.discussions) this.manuscript.discussions = [];
          this.manuscript.discussions.push(newDisc);
          this.filterFilesAndDiscussions();
          this.closeModal('addReviewDiscussionModal');
          this.newReviewDiscussionTitle = '';
          this.newReviewDiscussionMessage = '';
          this.newReviewDiscussionOrigin = null;
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

  openReviewActionModal(action: string): void {
    this.currentAction = action;
    switch (action) {
      case 'acceptReview':
        this.confirmationMessage = 'Are you sure you want to accept this manuscript and send it for copy-editing?';
        break;
      case 'requestRevision':
        this.confirmationMessage = 'Are you sure you want to request revisions?';
        break;
      case 'declineSubmission':
        this.confirmationMessage = 'Are you sure you want to decline this submission?';
        break;
      default:
        this.confirmationMessage = 'Are you sure you want to proceed?';
    }
    this.openModal('reviewConfirmationModal');
  }

  confirmReviewAction(): void {
    if (!this.manuscript?.id) {
      this.userToastNotificationService.showToast('Error', 'Manuscript ID missing.', 'danger');
      return;
    }

    const manuscriptId = Number(this.manuscript.id);
    let statusToUpdate = '';
    let successMessage = '';
    let errorMessage = '';

    switch (this.currentAction) {
      case 'acceptReview':
        statusToUpdate = 'ACCEPTED';
        successMessage = 'Manuscript accepted!';
        errorMessage = 'Failed to accept manuscript.';
        break;
      case 'requestRevision':
        statusToUpdate = 'REVISION_REQUIRED';
        successMessage = 'Revision requested!';
        errorMessage = 'Failed to request revision.';
        break;
      case 'declineSubmission':
        statusToUpdate = 'REJECTED';
        successMessage = 'Submission declined.';
        errorMessage = 'Failed to decline submission.';
        break;
      default:
        this.userToastNotificationService.showToast('Error', 'Invalid action.', 'danger');
        return;
    }

    // this.userToastNotificationService.showToast('Info', `Performing action: ${this.currentAction}...`, 'info');
    this.userManuscriptService.updateSubmissionStatus(manuscriptId, statusToUpdate).subscribe({
      next: (response) => {
        this.userToastNotificationService.showToast('Success', response.message || successMessage, 'success');
        this.manuscript.submissionStatus = response.data?.submissionStatus || statusToUpdate;
        this.manuscript.isEditable = response.data?.isEditable ?? (statusToUpdate === 'REVISION_REQUIRED');
        this.closeModal('reviewConfirmationModal');
      },
      error: (err) => {
        console.error('Review action error:', err);
        this.userToastNotificationService.showToast('Error', err.error?.message || errorMessage, 'danger');
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
