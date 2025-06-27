import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common'; // Include DatePipe for template
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, forkJoin } from 'rxjs'; // Import forkJoin for parallel calls
import { switchMap } from 'rxjs/operators';

// --- Interfaces from your shared user-manuscript.component ---
import { Manuscript, Discussion, SubmissionFile, DiscussionOrigin } from '../user-manuscript.component';
import { UserManuscriptService } from '../../../site-settings/manuscript/user-manuscript.service';
import { AuthLoginRegisterService } from '../../../site-settings/auth/auth-login-register.service';
import { UserToastNotificationService } from '../../../site-settings/toast-popup/user-toast-notification.service';

declare var bootstrap: any; // Declare bootstrap global

@Component({
  selector: 'app-manuscript-copyediting',
  imports: [CommonModule, FormsModule, DatePipe], // Add DatePipe to imports
  templateUrl: './manuscript-copyediting.component.html',
  styleUrl: './manuscript-copyediting.component.css',
  standalone: true
})
export class ManuscriptCopyeditingComponent implements OnInit {

  manuscript!: Manuscript; // Use definite assignment assertion
  currentUserId: number = 0; // Will be populated from AuthLoginRegisterService

  // File lists for display
  draftFiles: SubmissionFile[] = [];
  copyeditedFiles: SubmissionFile[] = [];
  copyeditingDiscussions: Discussion[] = [];

  selectedCopyeditedFile: File | null = null; // Holds the actual File object to be uploaded
  newCopyeditingDiscussionTitle: string = '';
  newCopyeditingDiscussionMessage: string = '';
  selectedDiscussion: Discussion | null = null; // Reused for viewing any discussion

  confirmationMessage: string = '';
  currentAction: string = ''; // Stores the action type for the confirmation modal

  // Discussion origin specifically for copy-editing discussions
  private discussionOrigin: DiscussionOrigin = DiscussionOrigin.COPY_EDIT; // Or a more specific COPY_EDIT if you create one

  selectedProductionFileId: number | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private userManuscriptService: UserManuscriptService,
    private authLoginRegisterService: AuthLoginRegisterService,
    private userToastNotificationService: UserToastNotificationService
  ) { }

  ngOnInit(): void {
    this.currentUserId = this.authLoginRegisterService.getUserID();
    this.route.parent?.paramMap.pipe(
      switchMap(params => {
        const manuscriptId = params.get('manuscriptId');
        if (manuscriptId && this.currentUserId) {
          return this.userManuscriptService.getManuscriptById(this.currentUserId, manuscriptId);
        }
        return of(undefined); // Return an observable of undefined if no ID
      })
    ).subscribe(manuscript => {
      if (manuscript) {
        this.manuscript = manuscript;
        console.log('Manuscript loaded for copyediting:', this.manuscript);
        this.filterFilesAndDiscussions(); // Filter files and discussions after manuscript loads
        this.loadDiscussions(Number(this.manuscript.id));
      } else {
        console.error('Manuscript not found for copyediting component or ID/User ID missing.');
        this.userToastNotificationService.showToast('Error', 'Manuscript not found or access denied.', 'danger');
        this.router.navigate(['/user/dashboard']); // Redirect if manuscript not found
      }
    });
  }

  /**
   * Filters files and discussions based on their origin/flags for display in this component.
   */
  filterFilesAndDiscussions(): void {
    if (this.manuscript && this.manuscript.files) {
      // Draft files for copyediting are those marked as isCopyEditingFile
      this.draftFiles = this.manuscript.files.filter(file => file.isCopyEditingFile);
      // Copyedited files are those with fileOrigin === 'COPY_EDIT'
      this.copyeditedFiles = this.manuscript.files.filter(file => file.fileOrigin === 'COPY_EDIT');
    } else {
      this.draftFiles = [];
      this.copyeditedFiles = [];
    }
  }

  /**
   * Loads discussions relevant to copy-editing from the backend.
   */
  loadDiscussions(submissionId: number): void {
    this.userManuscriptService.getDiscussionsForSubmission(submissionId).subscribe({
      next: (discussions) => {
        // Filter discussions specifically for COPY_EDIT origin
        this.copyeditingDiscussions = discussions.filter(d => d.origin === DiscussionOrigin.EDITORIAL || d.origin === DiscussionOrigin.COPY_EDIT); // Assuming EDITORIAL for general editor discussions or add COPY_EDIT specific
        console.log('Copyediting Discussions loaded:', this.copyeditingDiscussions);
      },
      error: (err) => {
        console.error('Error loading copyediting discussions:', err);
        this.userToastNotificationService.showToast('Error', 'Failed to load copyediting discussions.', 'danger');
      }
    });
  }

  /**
   * Checks if there are any copyedited files uploaded.
   * Used to disable/enable certain buttons.
   */
  hasCopyeditedFiles(): boolean {
    return this.copyeditedFiles && this.copyeditedFiles.length > 0;
  }

  /**
   * Downloads a file from a given URL.
   */
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

  // --- Copyedited File Upload Functions ---

  /**
   * Handles the selection of a copyedited file from the input.
   */
  onCopyeditedFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedCopyeditedFile = file;
      console.log('Copyedited file selected:', this.selectedCopyeditedFile.name);
    } else {
      this.selectedCopyeditedFile = null;
    }
  }

  /**
   * Uploads the selected copyedited file to the backend.
   */
  uploadCopyeditedFile(): void {
    if (this.selectedCopyeditedFile && this.manuscript?.id) {
      // this.userToastNotificationService.showToast('Info', 'Uploading copyedited file...', 'info');
      this.userManuscriptService.uploadCopyeditedFile(Number(this.manuscript.id), this.selectedCopyeditedFile).subscribe({
        next: (response) => {
          if (response?.code === 200 && response.data) {
            const newFile: SubmissionFile = {
              id: response.data.id,
              name: response.data.originalName,
              url: response.data.fileUrl,
              size: response.data.size, // Already in KB from service, assuming backend provides it this way or handle here
              storedName: response.data.storedName,
              isReviewFile: response.data.isReviewFile,
              isCopyEditingFile: response.data.isCopyEditingFile,
              fileOrigin: response.data.fileOrigin
            };
            if (!this.manuscript.files) this.manuscript.files = [];
            this.manuscript.files.push(newFile);
            this.filterFilesAndDiscussions(); // Re-filter to update lists
            this.selectedCopyeditedFile = null; // Clear selected file after upload
            this.closeModal('uploadCopyeditedFileModal'); // Close the modal
            this.userToastNotificationService.showToast('Success', 'Copyedited file uploaded successfully!', 'success');
          } else {
            this.userToastNotificationService.showToast('Error', 'Unexpected upload response.', 'danger');
          }
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.userToastNotificationService.showToast('Error', error.error?.message || 'Failed to upload copyedited file.', 'danger');
        }
      });
    } else {
      this.userToastNotificationService.showToast('Warning', 'No copyedited file selected or manuscript ID missing.', 'warning');
    }
  }

  // --- Copyediting Discussion Functions ---

  /**
   * Opens the "Add New Copyediting Discussion" modal.
   */
  addCopyeditingDiscussion(): void {
    this.newCopyeditingDiscussionTitle = '';
    this.newCopyeditingDiscussionMessage = '';
    this.openModal('addCopyeditingDiscussionModal');
  }

  /**
   * Confirms and adds a new copyediting discussion.
   */
  confirmAddCopyeditingDiscussion(): void {
    if (this.newCopyeditingDiscussionTitle && this.newCopyeditingDiscussionMessage && this.manuscript?.id) {
      // this.userToastNotificationService.showToast('Info', 'Adding discussion...', 'info');
      this.userManuscriptService.createDiscussion(
        Number(this.manuscript.id),
        this.currentUserId,
        this.newCopyeditingDiscussionTitle,
        this.newCopyeditingDiscussionMessage,
        this.discussionOrigin = DiscussionOrigin.COPY_EDIT // Use the pre-defined origin for copy-editing discussions
      ).subscribe({
        next: (newDisc) => {
          if (!this.manuscript.discussions) this.manuscript.discussions = [];
          this.manuscript.discussions.push(newDisc); // Add to main manuscript discussions
          this.loadDiscussions(Number(this.manuscript.id)); // Re-load and filter discussions
          this.closeModal('addCopyeditingDiscussionModal');
          this.newCopyeditingDiscussionTitle = '';
          this.newCopyeditingDiscussionMessage = '';
          this.userToastNotificationService.showToast('Success', 'Discussion added successfully!', 'success');
        },
        error: (err) => {
          console.error('Discussion error:', err);
          this.userToastNotificationService.showToast('Error', err.error?.message || 'Failed to add discussion.', 'danger');
        }
      });
    } else {
      this.userToastNotificationService.showToast('Warning', 'Please enter both title and message for the discussion.', 'warning');
    }
  }

  /**
   * Views the content of a selected discussion in a modal.
   */
  viewDiscussionContent(discussion: Discussion): void {
    this.selectedDiscussion = discussion;
    this.openModal('discussionContentModal');
  }

  // --- Copyediting Action Functions ---

  /**
   * Opens the confirmation modal for various copyediting actions.
   */
  openCopyeditingActionModal(action: string): void {
    this.currentAction = action;
    switch (action) {
      case 'completeCopyediting':
        this.confirmationMessage = 'Are you sure you want to mark copyediting as complete? This will move the manuscript to the Production stage.';
        break;
      case 'requestAuthorClarification':
        this.confirmationMessage = 'Are you sure you want to request clarification from the author? They will be notified and the manuscript will return to Revision Required status.';
        break;
      case 'sendToProofreading':
        this.confirmationMessage = 'Are you sure you want to send this manuscript to Proofreading? This will move it to the Production stage.';
        break;
      case 'declineSubmission':
        this.confirmationMessage = 'Are you sure you want to decline this submission?';
        break;
      default:
        this.confirmationMessage = 'Are you sure you want to proceed with this action?';
        break;
    }
    this.openModal('copyeditingConfirmationModal');
  }

  /**
   * Executes the confirmed copyediting action by updating manuscript status.
   */
  confirmCopyeditingAction(): void {
    if (!this.manuscript?.id) {
      this.userToastNotificationService.showToast('Error', 'Manuscript ID missing.', 'danger');
      return;
    }

    const manuscriptId = Number(this.manuscript.id);
    let statusToUpdate = '';
    let successMessage = '';
    let errorMessage = '';
    let navigateToRoute: string | null = null;

    switch (this.currentAction) {
      case 'completeCopyediting':
        statusToUpdate = 'PRODUCTION'; // Assuming 'PRODUCTION' or similar for the next stage
        successMessage = 'Copyediting marked as complete! Manuscript moved to Production.';
        errorMessage = 'Failed to mark copyediting as complete.';
        navigateToRoute = `/user/manuscript/${manuscriptId}/production`;
        break;
      case 'requestAuthorClarification':
        statusToUpdate = 'REVISION_REQUIRED'; // Set status to trigger author revision
        successMessage = 'Clarification request sent to author! Manuscript status updated.';
        errorMessage = 'Failed to request author clarification.';
        navigateToRoute = `/user/manuscript/${manuscriptId}/submission`; // Send back to submission for author
        break;
      case 'sendToProofreading':
        statusToUpdate = 'PRODUCTION'; // Moves to production stage, often includes proofreading
        successMessage = 'Manuscript sent to Proofreading! Moving to Production.';
        errorMessage = 'Failed to send to proofreading.';
        navigateToRoute = `/user/manuscript/${manuscriptId}/production`;
        break;
      case 'declineSubmission':
        statusToUpdate = 'REJECTED';
        successMessage = 'Submission declined.';
        errorMessage = 'Failed to decline submission.';
        break;
    }

    if (statusToUpdate) {
      // this.userToastNotificationService.showToast('Info', `Performing action: ${this.currentAction}...`, 'info');
      this.userManuscriptService.updateSubmissionStatus(manuscriptId, statusToUpdate).subscribe({
        next: (response) => {
          this.userToastNotificationService.showToast('Success', response.message || successMessage, 'success');
          this.manuscript.submissionStatus = response.data?.submissionStatus || statusToUpdate;
          this.closeModal('copyeditingConfirmationModal');
          if (navigateToRoute) {
            this.router.navigate([navigateToRoute]);
          }
        },
        error: (err) => {
          console.error('Copyediting action error:', err);
          this.userToastNotificationService.showToast('Error', err.error?.message || errorMessage, 'danger');
        }
      });
    }
  }

  // --- Utility Functions for Modals (using Bootstrap 5's JS API) ---
  openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const bootstrapModal = new bootstrap.Modal(modalElement); // Use direct import
      bootstrapModal.show();
    }
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const bootstrapModal = bootstrap.Modal.getInstance(modalElement); // Use direct import
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }

  // Add this method to open the file selection modal
openSelectProductionFileModal(): void {
    this.selectedProductionFileId = null; // Reset selection
    this.openModal('selectProductionFileModal');
}

// Add this method to handle the confirmation with file selection
confirmCompleteCopyeditingWithFile(): void {
    if (!this.manuscript?.id || this.selectedProductionFileId === null) {
        this.userToastNotificationService.showToast('Error', 'Manuscript ID or selected file missing.', 'danger');
        return;
    }

    const manuscriptId = Number(this.manuscript.id);
    const fileIdForProduction = this.selectedProductionFileId;

    // this.userToastNotificationService.showToast('Info', 'Completing copyediting and preparing for production...', 'info');

    // Make two API calls: one to update status and another to select the production file
    forkJoin([
        this.userManuscriptService.updateSubmissionStatus(manuscriptId, 'PRODUCTION'),
        this.userManuscriptService.selectFileForProduction(manuscriptId, fileIdForProduction)
    ]).subscribe({
        next: ([statusResponse, fileSelectionResponse]) => {
            // Update local manuscript status
            this.manuscript.submissionStatus = statusResponse.data?.submissionStatus || 'PRODUCTION';
            
            // Update local file data to reflect the production file status
            if (this.manuscript.files) {
                this.manuscript.files.forEach(file => {
                    file.isProductionFile = (file.id === fileIdForProduction);
                });
            }

            this.userToastNotificationService.showToast('Success', 'Copyediting completed and file sent for production!', 'success');
            this.closeModal('selectProductionFileModal');
            this.selectedProductionFileId = null;
            
            // Navigate to production page
            this.router.navigate([`/user/manuscript/${manuscriptId}/production`]);
        },
        error: (error) => {
            console.error('Error during complete copyediting and file selection:', error);
            this.userToastNotificationService.showToast('Error', error.error?.message || 'Failed to complete copyediting or select file for production.', 'danger');
        }
    });
}

// Modify the existing completeCopyediting method to use the new file selection
completeCopyediting(): void {
    // if (this.hasCopyeditedFiles()) {
    //     this.openSelectProductionFileModal();
    // } else {
    //     this.openCopyeditingActionModal('completeCopyediting');
    // }
    this.openSelectProductionFileModal()
}

}
