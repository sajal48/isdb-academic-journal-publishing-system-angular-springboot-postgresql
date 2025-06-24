import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- Reused Interfaces ---
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

// --- Manuscript Interface (updated for Production) ---
interface Manuscript {
  id: string;
  productionReadyFiles: CustomFile[];
  productionDiscussions: Discussion[];
  owner: User;
  // ... other manuscript properties
}
@Component({
  selector: 'app-manuscript-production',
  imports: [CommonModule, FormsModule],
  templateUrl: './manuscript-production.component.html',
  styleUrl: './manuscript-production.component.css'
})
export class ManuscriptProductionComponent implements OnInit {

  manuscript: Manuscript | null = null;
  currentUserId: string = 'production_manager456'; // Simulate current user ID

  selectedProductionFile: CustomFile | null = null;
  newProductionDiscussionTitle: string = '';
  newProductionDiscussionMessage: string = '';
  selectedDiscussion: Discussion | null = null; // Reused for viewing any discussion

  confirmationMessage: string = '';
  currentAction: string = ''; // Stores the action type for the confirmation modal

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadManuscriptDetails('manuscript123'); // Load a dummy manuscript
  }

  /**
   * Loads manuscript details for production from a (mock) API.
   */
  loadManuscriptDetails(manuscriptId: string): void {
    // Simulate API call
    setTimeout(() => {
      this.manuscript = {
        id: manuscriptId,
        productionReadyFiles: [
          { name: 'Final_Manuscript_Layout.pdf', size: 3500000, url: '/assets/final_layout.pdf' },
          { name: 'Web_Optimized_Images.zip', size: 800000, url: '/assets/web_images.zip' }
        ],
        productionDiscussions: [
          {
            id: 'prodDisc1',
            title: 'Proof for Final Review',
            content: 'The final PDF proof is ready. Please review and provide approval for publication.',
            creatorName: 'Production Mgr David',
            createdAt: new Date('2025-06-24T10:00:00Z')
          },
          {
            id: 'prodDisc2',
            title: 'DOI Assignment Status',
            content: 'Waiting on DOI assignment from CrossRef. Will update once received.',
            creatorName: 'Production Assistant Eve',
            createdAt: new Date('2025-06-24T14:15:00Z')
          }
        ],
        owner: { userId: 'author456' } // Example owner
      };
      console.log('Manuscript loaded for production:', this.manuscript);
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

  // --- Production File Upload Functions ---

  /**
   * Handles the selection of a production file.
   */
  onProductionFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedProductionFile = {
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file as Blob) // Explicitly cast to Blob
      };
      console.log('Production file selected:', this.selectedProductionFile);
    } else {
      this.selectedProductionFile = null;
    }
  }

  /**
   * Uploads the selected production file.
   */
  uploadProductionFile(): void {
    if (this.selectedProductionFile && this.manuscript) {
      console.log('Uploading production file:', this.selectedProductionFile.name);
      // Simulate file upload to a backend
      // this.http.post('/api/upload-production-file', formData).subscribe(...)

      // Add to manuscript's productionReadyFiles array for immediate UI update
      this.manuscript.productionReadyFiles.push({ ...this.selectedProductionFile });
      this.selectedProductionFile = null; // Clear selected file after upload
      this.closeModal('uploadProductionFileModal'); // Close the modal
      alert('Production file uploaded successfully!');
    } else {
      alert('No production file selected to upload.');
    }
  }

  // --- Production Discussion Functions ---

  /**
   * Opens the "Add New Production Discussion" modal.
   */
  addProductionDiscussion(): void {
    this.newProductionDiscussionTitle = '';
    this.newProductionDiscussionMessage = '';
    this.openModal('addProductionDiscussionModal');
  }

  /**
   * Confirms and adds a new production discussion.
   */
  confirmAddProductionDiscussion(): void {
    if (this.newProductionDiscussionTitle && this.newProductionDiscussionMessage && this.manuscript) {
      const newDisc: Discussion = {
        id: `prodDisc${Date.now()}`, // Simple unique ID
        title: this.newProductionDiscussionTitle,
        content: this.newProductionDiscussionMessage,
        creatorName: 'Current User (Production)', // Replace with actual current user
        createdAt: new Date()
      };
      this.manuscript.productionDiscussions.push(newDisc);
      console.log('New production discussion added:', newDisc);
      this.closeModal('addProductionDiscussionModal');
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

  // --- Production Action Functions ---

  /**
   * Opens the confirmation modal for various production actions.
   */
  openProductionActionModal(action: string): void {
    this.currentAction = action;
    switch (action) {
      case 'scheduleForPublication':
        this.confirmationMessage = 'Are you sure you want to schedule this manuscript for publication?';
        break;
      case 'requestFinalApproval':
        this.confirmationMessage = 'Are you sure you want to request final approval for this manuscript?';
        break;
      case 'haltProduction':
        this.confirmationMessage = 'WARNING: Are you absolutely sure you want to halt production for this manuscript? This action might require further justification.';
        break;
      default:
        this.confirmationMessage = 'Are you sure you want to proceed with this action?';
        break;
    }
    this.openModal('productionConfirmationModal');
  }

  /**
   * Executes the confirmed production action.
   */
  confirmProductionAction(): void {
    console.log(`Confirmed action: ${this.currentAction}`);
    // Implement the actual logic for each action here
    switch (this.currentAction) {
      case 'scheduleForPublication':
        alert('Manuscript scheduled for publication!');
        // Call service to update manuscript status and schedule
        break;
      case 'requestFinalApproval':
        alert('Final approval requested!');
        // Call service to notify relevant parties
        break;
      case 'haltProduction':
        alert('Production halted for manuscript!');
        // Call service to change status and trigger necessary alerts
        break;
    }
    this.closeModal('productionConfirmationModal');
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
