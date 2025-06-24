import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- Interfaces for data structure ---
interface CustomFile {
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
  draftFiles: CustomFile[];
  copyeditedFiles: CustomFile[];
  copyeditingDiscussions: Discussion[];
  owner: User;
  // ... other manuscript properties
}

@Component({
  selector: 'app-manuscript-copyediting',
  imports: [CommonModule, FormsModule],
  templateUrl: './manuscript-copyediting.component.html',
  styleUrl: './manuscript-copyediting.component.css'
})
export class ManuscriptCopyeditingComponent implements OnInit {

  manuscript: Manuscript | null = null;
  currentUserId: string = 'copyeditor123'; // Simulate current user ID

  selectedCopyeditedFile: CustomFile | null = null;
  newCopyeditingDiscussionTitle: string = '';
  newCopyeditingDiscussionMessage: string = '';
  selectedDiscussion: Discussion | null = null; // Reused for viewing any discussion

  confirmationMessage: string = '';
  currentAction: string = ''; // Stores the action type for the confirmation modal

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadManuscriptDetails('manuscript123'); // Load a dummy manuscript
  }

  /**
   * Loads manuscript details for copyediting from a (mock) API.
   * In a real application, you'd fetch this dynamically.
   */
  loadManuscriptDetails(manuscriptId: string): void {
    // Simulate API call
    setTimeout(() => {
      this.manuscript = {
        id: manuscriptId,
        draftFiles: [
          { name: 'Manuscript Draft V1.docx', size: 1800000, url: '/assets/draft_v1.docx' },
          { name: 'Supplementary Data.xlsx', size: 500000, url: '/assets/supplementary_data.xlsx' }
        ],
        copyeditedFiles: [
          { name: 'Manuscript Copyedited V1.docx', size: 1900000, url: '/assets/copyedited_v1.docx' }
        ],
        copyeditingDiscussions: [
          {
            id: 'copyDisc1',
            title: 'Query about References Formatting',
            content: 'Could the author clarify the formatting style used for references? It seems inconsistent.',
            creatorName: 'Copyeditor Charlie',
            createdAt: new Date('2025-06-22T09:00:00Z')
          },
          {
            id: 'copyDisc2',
            title: 'Caption for Figure 2',
            content: 'The caption for Figure 2 is missing key details. Please expand.',
            creatorName: 'Copyeditor Charlie',
            createdAt: new Date('2025-06-23T11:45:00Z')
          }
        ],
        owner: { userId: 'author456' } // Example owner
      };
      console.log('Manuscript loaded for copyediting:', this.manuscript);
    }, 500);
  }

  /**
   * Downloads a file.
   */
  downloadFile(url: string, fileName: string): void {
    console.log(`Downloading: ${fileName} from ${url}`);
    alert(`Initiating download for: ${fileName}`);
    window.open(url, '_blank');
  }

  // --- Copyedited File Upload Functions ---

  /**
   * Handles the selection of a copyedited file.
   */
  onCopyeditedFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedCopyeditedFile = {
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file as Blob) // Explicitly cast to Blob
      };
      console.log('Copyedited file selected:', this.selectedCopyeditedFile);
    } else {
      this.selectedCopyeditedFile = null;
    }
  }

  /**
   * Uploads the selected copyedited file.
   */
  uploadCopyeditedFile(): void {
    if (this.selectedCopyeditedFile && this.manuscript) {
      console.log('Uploading copyedited file:', this.selectedCopyeditedFile.name);
      // Simulate file upload to a backend
      // this.http.post('/api/upload-copyedited-file', formData).subscribe(...)

      // Add to manuscript's copyeditedFiles array for immediate UI update
      this.manuscript.copyeditedFiles.push({ ...this.selectedCopyeditedFile });
      this.selectedCopyeditedFile = null; // Clear selected file after upload
      this.closeModal('uploadCopyeditedFileModal'); // Close the modal
      alert('Copyedited file uploaded successfully!');
    } else {
      alert('No copyedited file selected to upload.');
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
    if (this.newCopyeditingDiscussionTitle && this.newCopyeditingDiscussionMessage && this.manuscript) {
      const newDisc: Discussion = {
        id: `copyDisc${Date.now()}`, // Simple unique ID
        title: this.newCopyeditingDiscussionTitle,
        content: this.newCopyeditingDiscussionMessage,
        creatorName: 'Current User (Copyeditor)', // Replace with actual current user
        createdAt: new Date()
      };
      this.manuscript.copyeditingDiscussions.push(newDisc);
      console.log('New copyediting discussion added:', newDisc);
      this.closeModal('addCopyeditingDiscussionModal');
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

  // --- Copyediting Action Functions ---

  /**
   * Opens the confirmation modal for various copyediting actions.
   */
  openCopyeditingActionModal(action: string): void {
    this.currentAction = action;
    switch (action) {
      case 'completeCopyediting':
        this.confirmationMessage = 'Are you sure you want to mark copyediting as complete? This will move the manuscript to the next stage.';
        break;
      case 'requestAuthorClarification':
        this.confirmationMessage = 'Are you sure you want to request clarification from the author? They will be notified.';
        break;
      case 'sendToProofreading':
        this.confirmationMessage = 'Are you sure you want to send this manuscript to proofreading?';
        break;
      default:
        this.confirmationMessage = 'Are you sure you want to proceed with this action?';
        break;
    }
    this.openModal('copyeditingConfirmationModal');
  }

  /**
   * Executes the confirmed copyediting action.
   */
  confirmCopyeditingAction(): void {
    console.log(`Confirmed action: ${this.currentAction}`);
    // Implement the actual logic for each action here
    switch (this.currentAction) {
      case 'completeCopyediting':
        alert('Copyediting marked as complete!');
        // Call service to update manuscript status
        break;
      case 'requestAuthorClarification':
        alert('Clarification request sent to author!');
        // Call service to notify author and potentially change manuscript status
        break;
      case 'sendToProofreading':
        alert('Manuscript sent to proofreading!');
        // Call service to transition manuscript to proofreading stage
        break;
    }
    this.closeModal('copyeditingConfirmationModal');
  }

  // --- Utility Functions for Modals (using Bootstrap 5's JS API) ---
  openModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
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