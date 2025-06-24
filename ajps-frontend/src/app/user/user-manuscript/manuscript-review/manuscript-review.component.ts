import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- Interfaces for data structure ---
interface File {
  name: string;
  size: number; // in bytes
  url: string;
}

interface Discussion {
  id: string;
  title: string;
  content: string;
  creatorName: string;
  createdAt: Date;
}

interface User {
  userId: string;
  // ... other user properties
}

interface Manuscript {
  id: string;
  submissionFiles: File[];
  revisionFiles: File[];
  reviewDiscussions: Discussion[];
  owner: User;
  // ... other manuscript properties
}
@Component({
  selector: 'app-manuscript-review',
  imports: [CommonModule, FormsModule],
  templateUrl: './manuscript-review.component.html',
  styleUrl: './manuscript-review.component.css'
})
export class ManuscriptReviewComponent implements OnInit {

  manuscript: Manuscript | null = null;
  currentUserId: string = 'reviewer123'; // Simulate current user ID for conditional display

  selectedRevisionFile: File | null = null;
  newReviewDiscussionTitle: string = '';
  newReviewDiscussionMessage: string = '';
  selectedDiscussion: Discussion | null = null;

  confirmationMessage: string = '';
  currentAction: string = ''; // Stores the action type for the confirmation modal

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadManuscriptDetails('manuscript123'); // Load a dummy manuscript for demonstration
  }

  /**
   * Loads manuscript details from a (mock) API.
   * In a real application, you'd fetch this dynamically based on route parameters.
   */
  loadManuscriptDetails(manuscriptId: string): void {
    // Simulate API call
    setTimeout(() => {
      this.manuscript = {
        id: manuscriptId,
        submissionFiles: [
          { name: 'Original Manuscript.pdf', size: 2500000, url: '/assets/original_manuscript.pdf' },
          { name: 'Figures.zip', size: 1200000, url: '/assets/figures.zip' }
        ],
        revisionFiles: [
          { name: 'Revised Manuscript V1.pdf', size: 2600000, url: '/assets/revised_manuscript_v1.pdf' }
        ],
        reviewDiscussions: [
          {
            id: 'disc1',
            title: 'Minor Revisions Required',
            content: 'The introduction needs to be expanded to provide more context on previous research.',
            creatorName: 'Editor Alice',
            createdAt: new Date('2025-06-20T10:00:00Z')
          },
          {
            id: 'disc2',
            title: 'Figures Clarity',
            content: 'Figure 3 is blurry; please provide a higher resolution version.',
            creatorName: 'Reviewer Bob',
            createdAt: new Date('2025-06-21T14:30:00Z')
          }
        ],
        owner: { userId: 'author456' } // Example owner
      };
      console.log('Manuscript loaded:', this.manuscript);
    }, 500);
  }

  /**
   * Downloads a file.
   */
  downloadFile(url: string, fileName: string): void {
    console.log(`Downloading: ${fileName} from ${url}`);
    // In a real application, you'd use HttpClient to fetch the blob and then trigger download.
    // For demonstration, a simple alert or console log.
    alert(`Initiating download for: ${fileName}`);
    window.open(url, '_blank'); // Opens the URL in a new tab for download
  }

  // --- Revision File Upload Functions ---

  /**
   * Handles the selection of a revision file.
   */
  onRevisionFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedRevisionFile = {
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file as unknown as Blob) // Create a temporary URL for preview/display
      };
      console.log('Revision file selected:', this.selectedRevisionFile);
    } else {
      this.selectedRevisionFile = null;
    }
  }

  /**
   * Uploads the selected revision file.
   */
  uploadRevisionFile(): void {
    if (this.selectedRevisionFile && this.manuscript) {
      console.log('Uploading revision file:', this.selectedRevisionFile.name);
      // Simulate file upload to a backend
      // In a real application, you'd use HttpClient to send FormData
      // this.http.post('/api/upload-revision', formData).subscribe(...)

      // Add to manuscript's revisionFiles array for immediate UI update
      this.manuscript.revisionFiles.push({ ...this.selectedRevisionFile });
      this.selectedRevisionFile = null; // Clear selected file after upload
      this.closeModal('uploadRevisionFileModal'); // Close the modal
      alert('Revision file uploaded successfully!');
    } else {
      alert('No revision file selected to upload.');
    }
  }

  // --- Review Discussion Functions ---

  /**
   * Opens the "Add New Review Discussion" modal.
   */
  addReviewDiscussion(): void {
    this.newReviewDiscussionTitle = '';
    this.newReviewDiscussionMessage = '';
    this.openModal('addReviewDiscussionModal');
  }

  /**
   * Confirms and adds a new review discussion.
   */
  confirmAddReviewDiscussion(): void {
    if (this.newReviewDiscussionTitle && this.newReviewDiscussionMessage && this.manuscript) {
      const newDisc: Discussion = {
        id: `disc${Date.now()}`, // Simple unique ID
        title: this.newReviewDiscussionTitle,
        content: this.newReviewDiscussionMessage,
        creatorName: 'Current User (Reviewer)', // Replace with actual current user
        createdAt: new Date()
      };
      this.manuscript.reviewDiscussions.push(newDisc);
      console.log('New review discussion added:', newDisc);
      this.closeModal('addReviewDiscussionModal');
      alert('Discussion added successfully!');
    } else {
      alert('Please enter both title and message for the discussion.');
    }
  }

  /**
   * Views the content of a selected discussion in a modal.
   */
  viewDiscussionContent(discussion: Discussion): void {
    this.selectedDiscussion = discussion;
    this.openModal('discussionContentModal');
  }

  // --- Review Action Functions ---

  /**
   * Opens the confirmation modal for various review actions.
   */
  openReviewActionModal(action: string): void {
    this.currentAction = action;
    switch (action) {
      case 'submitReview':
        this.confirmationMessage = 'Are you sure you want to submit your review for this manuscript?';
        break;
      case 'requestRevision':
        this.confirmationMessage = 'Are you sure you want to request revisions for this manuscript? This will notify the author.';
        break;
      case 'assignNewReviewer':
        this.confirmationMessage = 'Are you sure you want to assign a new reviewer? This action may require additional steps.';
        break;
      default:
        this.confirmationMessage = 'Are you sure you want to proceed with this action?';
        break;
    }
    this.openModal('reviewConfirmationModal');
  }

  /**
   * Executes the confirmed review action.
   */
  confirmReviewAction(): void {
    console.log(`Confirmed action: ${this.currentAction}`);
    // Implement the actual logic for each action here
    switch (this.currentAction) {
      case 'submitReview':
        alert('Review submitted successfully!');
        // Call service to submit review data
        break;
      case 'requestRevision':
        alert('Revision request sent to author!');
        // Call service to update manuscript status and notify author
        break;
      case 'assignNewReviewer':
        alert('Prompting for new reviewer details...');
        // Open another modal or navigate to assignment page
        break;
    }
    this.closeModal('reviewConfirmationModal');
  }

  // --- Utility Functions for Modals (using Bootstrap 5's JS API) ---
  // You might want to use a dedicated Angular library for modals (like ng-bootstrap or Angular Material)
  // for a more "Angular" way of handling them. This is a direct JS approach.

  openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      // Ensure Bootstrap's JS is loaded
      const bootstrapModal = new (window as any).bootstrap.Modal(modalElement);
      bootstrapModal.show();
    }
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const bootstrapModal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }
  }
}
