import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Manuscript } from '../user-manuscript.component'; // Adjust path to where Manuscript interface is defined
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
  selectedFile: File | null = null;
  assignedParticipantName: string = '';

  selectedDiscussion: any = null; // Can be a more specific interface if needed

  // IMPORTANT: Replace with a dynamic userId from authentication or user session
  private currentUserId: number = 0; // <<--- SET A VALID USER ID HERE (e.g., from logged-in user)


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
          // Pass both userId and manuscriptId to the service
          return this.manuscriptService.getManuscriptById(this.currentUserId, manuscriptId);
        }
        return of(undefined);
      })
    ).subscribe(manuscript => {
      if (manuscript) {
        this.manuscript = manuscript;
        console.log('Manuscript loaded for submission:', this.manuscript);
      } else {
        console.error('Manuscript not found for submission component or ID/User ID missing.');
      }
    });
  }

  // --- File Upload Logic ---
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadFile(): void {
    if (this.selectedFile && this.manuscript && this.manuscript.id) {
      console.log('Uploading file:', this.selectedFile.name);
      // In a real scenario, you'd send this.selectedFile to a backend upload endpoint
      // and then update the manuscript.files array with the actual server response.
      // For now, simulate adding the file:
      if (!this.manuscript.files) {
        this.manuscript.files = [];
      }
      this.manuscript.files.push({
        name: this.selectedFile.name,
        url: URL.createObjectURL(this.selectedFile), // This is a temporary client-side URL
        size: (this.selectedFile.size / 1024).toFixed(2)
      });
      alert('File upload simulated successfully!');
      this.selectedFile = null;
      const uploadModal = bootstrap.Modal.getInstance(document.getElementById('uploadFileModal'));
      if (uploadModal) {
        uploadModal.hide();
      }
    } else {
      alert('No file selected or manuscript ID is missing.');
    }
  }

  /*downloadFile(fileUrl: string, fileName: string): void {
    // For real backend files, fileUrl will be the direct URL from the backend
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName; // Suggests filename for download
    link.target = '_blank'; // Opens in a new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }*/
 downloadFile(fileUrl: string, originalFileName: string): void {

    const downloadUrl = fileUrl;

    this.http.get(downloadUrl, { responseType: 'blob' })
      .subscribe({
        next: (response: Blob) => {
          // Create a blob URL and trigger the download
          const blob = new Blob([response], { type: response.type });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = originalFileName; // Use the original file name
          document.body.appendChild(a); // Append to body (required for Firefox)
          a.click(); // Programmatically click the link to trigger download
          window.URL.revokeObjectURL(url); // Clean up the URL object

        },
        error: (error: any) => {
          // console.error('Error downloading file:', error);
          // alert('Failed to download file. Please try again.');
          this.userToastNotificationService.showToast('Error', 'Failed to download file. Please try again.', 'danger');
        }
      });
  }

  // --- Discussion Logic ---
  addDiscussion(): void {
    this.newDiscussionTitle = '';
    this.newDiscussionMessage = '';
    const discussionModal = new bootstrap.Modal(document.getElementById('addDiscussionModal'));
    discussionModal.show();
  }

  confirmAddDiscussion(): void {
    if (this.newDiscussionTitle && this.newDiscussionMessage) {
      const newDisc = {
        name: this.newDiscussionTitle,
        from: 'Current User', // Replace with actual user name
        lastReply: new Date(),
        replies: 0,
        closed: false,
        // Adding a placeholder for actual messages/replies for the detail view
        messages: [{ sender: 'Current User', text: this.newDiscussionMessage, date: new Date() }]
      };
      if (!this.manuscript.discussions) {
        this.manuscript.discussions = [];
      }
      this.manuscript.discussions.push(newDisc);
      console.log('New discussion added:', newDisc);
      alert('Discussion added successfully!');
      const discussionModal = bootstrap.Modal.getInstance(document.getElementById('addDiscussionModal'));
      if (discussionModal) {
        discussionModal.hide();
      }
      // In a real app, you'd send this new discussion to your backend API
    } else {
      alert('Please provide both a title and a message for the discussion.');
    }
  }

  // New method to open discussion details modal
  viewDiscussionDetails(discussion: any): void {
    this.selectedDiscussion = discussion;
    const detailModal = new bootstrap.Modal(document.getElementById('discussionDetailModal'));
    detailModal.show();
  }


  // --- Action Buttons Logic (with Modals) ---
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
    alert('Manuscript sent to review!');
    if (this.manuscript) {
      this.manuscript.status!.submission = 'Sent to Review';
      // In a real app, send a request to backend to update status
    }
  }

  private _acceptAndSkipReview(): void {
    alert('Manuscript accepted and review skipped!');
    if (this.manuscript) {
      this.manuscript.status!.submission = 'Accepted';
      this.manuscript.status!.review = 'Skipped';
      // In a real app, send a request to backend to update status
    }
  }

  private _declineSubmission(): void {
    alert('Manuscript submission declined!');
    if (this.manuscript) {
      this.manuscript.status!.submission = 'Declined';
      // In a real app, send a request to backend to update status
    }
  }

  // --- Assign Participant Logic ---
  assignParticipant(): void {
    this.assignedParticipantName = '';
    const assignModal = new bootstrap.Modal(document.getElementById('assignParticipantModal'));
    assignModal.show();
  }

  confirmAssignParticipant(): void {
    if (this.assignedParticipantName) {
      alert(`Participant '${this.assignedParticipantName}' assigned!`);
      console.log('Assigning participant:', this.assignedParticipantName);
      // In a real app, send a request to backend to assign participant
      const assignModal = bootstrap.Modal.getInstance(document.getElementById('assignParticipantModal'));
      if (assignModal) {
        assignModal.hide();
      }
    } else {
      alert('Please enter a participant name.');
    }
  }
}