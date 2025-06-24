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

interface Author {
  name: string;
  affiliation: string;
  email: string;
  orcid?: string; // ORCID is optional
}

interface User {
  userId: string;
  // ... other user properties
}

// --- New Interfaces for Journal/Volume/Issue Structure ---
interface Journal {
  id: string;
  name: string;
}

interface Volume {
  id: string;
  journalId: string;
  number: number;
  year: number;
}

interface Issue {
  id: string;
  volumeId: string;
  number: number;
  title: string;
  // publicationDate: Date; // Could add this for display
}

// --- Manuscript Interface (updated for Publication) ---
interface Manuscript {
  id: string;
  title: string;
  keywords: string[];
  abstract: string;
  authors: Author[];
  doi?: string; // DOI might not be assigned yet
  articleFile: CustomFile | null; // The final published article file
  publicationStatus: 'Draft' | 'Scheduled' | 'Published' | 'Unpublished';
  journalId?: string; // ID of the assigned journal
  volumeId?: string;  // ID of the assigned volume
  issueId?: string;   // ID of the assigned issue
  // publicationDiscussions: Discussion[]; // Removed as not requested for this page, but can be added back
  owner: User;
  // ... other manuscript properties
}
@Component({
  selector: 'app-manuscript-publication',
  imports: [CommonModule, FormsModule],
  templateUrl: './manuscript-publication.component.html',
  styleUrl: './manuscript-publication.component.css'
})
export class ManuscriptPublicationComponent implements OnInit {

  manuscript: Manuscript | null = null;
  currentUserId: string = 'pub_admin123'; // Simulate current user ID

  selectedArticleFile: CustomFile | null = null;
  keywordsString: string = ''; // For two-way binding with keywords textarea

  // For Journal/Volume/Issue Selection
  journals: Journal[] = [];
  volumes: Volume[] = [];
  issues: Issue[] = [];

  filteredVolumes: Volume[] = [];
  filteredIssues: Issue[] = [];

  selectedJournalId: string | null = null;
  selectedVolumeId: string | null = null;
  selectedIssueId: string | null = null;

  // For Modals
  confirmationMessage: string = '';
  currentAction: string = ''; // Stores the action type for the confirmation modal
  selectedDiscussion: Discussion | null = null; // Included for consistency, though no discussions UI on this specific page

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadManuscriptDetails('manuscript123'); // Load a dummy manuscript
    this.loadPublicationData(); // Load journals, volumes, issues
  }

  /**
   * Loads manuscript details for publication.
   */
  loadManuscriptDetails(manuscriptId: string): void {
    // Simulate API call
    setTimeout(() => {
      this.manuscript = {
        id: manuscriptId,
        title: 'The Impact of AI on Modern Education Systems: A Longitudinal Study',
        keywords: ['Artificial Intelligence', 'Education', 'Technology', 'Learning Outcomes'],
        abstract: 'This study investigates the profound effects of integrating artificial intelligence (AI) technologies into primary and secondary education systems over a ten-year period. Utilizing a mixed-methods approach, data was collected from over 500 schools across various regions, analyzing student performance, teacher adaptability, and administrative efficiency. Findings indicate a significant positive correlation between strategic AI implementation and improved personalized learning experiences, alongside challenges related to digital equity and teacher training. The research highlights the critical role of policy frameworks in harnessing AI\'s potential for a transformative educational landscape.',
        authors: [
          { name: 'Dr. Jane Doe', affiliation: 'Department of Educational Technology, University of Global Studies', email: 'jane.doe@example.edu', orcid: '0000-0001-2345-6789' },
          { name: 'Prof. John Smith', affiliation: 'Faculty of Computer Science, Tech University', email: 'john.smith@example.com' }
        ],
        doi: '10.1234/journal.2025.12345',
        articleFile: { name: 'Final_Article_v1.0.pdf', size: 4500000, url: '/assets/final_article.pdf' },
        publicationStatus: 'Scheduled', // Example status
        // journalId: 'journalA', // If already assigned
        // volumeId: 'volA1',   // If already assigned
        // issueId: 'issueA1_2', // If already assigned
        owner: { userId: 'author456' }
      };

      // Initialize keywordsString for the textarea
      this.keywordsString = this.manuscript.keywords ? this.manuscript.keywords.join(', ') : '';

      // Set initial selections if manuscript already has assigned issue
      if (this.manuscript.journalId) this.selectedJournalId = this.manuscript.journalId;
      if (this.manuscript.volumeId) this.selectedVolumeId = this.manuscript.volumeId;
      if (this.manuscript.issueId) this.selectedIssueId = this.manuscript.issueId;

      this.onJournalChange(); // Filter volumes based on initial journal
      this.onVolumeChange();   // Filter issues based on initial volume

      console.log('Manuscript loaded for publication:', this.manuscript);
    }, 500);
  }

  /**
   * Loads dummy data for journals, volumes, and issues.
   * In a real app, this would come from an API.
   */
  loadPublicationData(): void {
    // Simulate API call
    setTimeout(() => {
      this.journals = [
        { id: 'journalA', name: 'Journal of Academic Research' },
        { id: 'journalB', name: 'International Tech Review' },
        { id: 'journalC', name: 'Educational Studies Quarterly' }
      ];

      this.volumes = [
        { id: 'volA1', journalId: 'journalA', number: 1, year: 2024 },
        { id: 'volA2', journalId: 'journalA', number: 2, year: 2025 },
        { id: 'volB1', journalId: 'journalB', number: 1, year: 2024 },
        { id: 'volC1', journalId: 'journalC', number: 1, year: 2025 }
      ];

      this.issues = [
        { id: 'issueA1_1', volumeId: 'volA1', number: 1, title: 'Spring Issue' },
        { id: 'issueA1_2', volumeId: 'volA1', number: 2, title: 'Summer Issue' },
        { id: 'issueA2_1', volumeId: 'volA2', number: 1, title: 'Special Issue on AI' },
        { id: 'issueB1_1', volumeId: 'volB1', number: 1, title: 'Emerging Technologies' },
        { id: 'issueC1_1', volumeId: 'volC1', number: 1, title: 'Education Policy' }
      ];

      // Re-apply filters if initial manuscript data exists
      if (this.manuscript?.journalId) {
        this.onJournalChange();
        if (this.manuscript?.volumeId) {
          this.onVolumeChange();
        }
      }
    }, 700);
  }

  /**
   * Filters volumes based on the selected journal.
   */
  onJournalChange(): void {
    this.filteredVolumes = this.selectedJournalId
      ? this.volumes.filter(v => v.journalId === this.selectedJournalId)
      : [];
    this.selectedVolumeId = null; // Reset volume when journal changes
    this.selectedIssueId = null;  // Reset issue when journal changes
    this.filteredIssues = [];
  }

  /**
   * Filters issues based on the selected volume.
   */
  onVolumeChange(): void {
    this.filteredIssues = this.selectedVolumeId
      ? this.issues.filter(i => i.volumeId === this.selectedVolumeId)
      : [];
    this.selectedIssueId = null; // Reset issue when volume changes
  }

  /**
   * Assigns the selected journal issue to the manuscript.
   */
  assignIssue(): void {
    if (this.manuscript && this.selectedJournalId && this.selectedVolumeId && this.selectedIssueId) {
      this.manuscript.journalId = this.selectedJournalId;
      this.manuscript.volumeId = this.selectedVolumeId;
      this.manuscript.issueId = this.selectedIssueId;
      console.log('Manuscript assigned to issue:', {
        journalId: this.selectedJournalId,
        volumeId: this.selectedVolumeId,
        issueId: this.selectedIssueId
      });
      alert('Manuscript successfully assigned to the selected issue!');
      this.saveAllChanges(); // Trigger a save after assigning
    } else {
      alert('Please select a Journal, Volume, and Issue.');
    }
  }

  /**
   * Downloads a file.
   */
  downloadFile(url: string, fileName: string): void {
    console.log(`Downloading: ${fileName} from ${url}`);
    alert(`Initiating download for: ${fileName}`);
    window.open(url, '_blank');
  }

  // --- Article File Upload Functions ---

  /**
   * Handles the selection of the final article file.
   */
  onArticleFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedArticleFile = {
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file as Blob) // Explicitly cast to Blob
      };
      console.log('Final article file selected:', this.selectedArticleFile);
    } else {
      this.selectedArticleFile = null;
    }
  }

  /**
   * Uploads the selected final article file.
   */
  uploadArticleFile(): void {
    if (this.selectedArticleFile && this.manuscript) {
      console.log('Uploading final article file:', this.selectedArticleFile.name);
      // Simulate file upload to a backend
      // this.http.post('/api/upload-article-file', formData).subscribe(...)

      this.manuscript.articleFile = { ...this.selectedArticleFile }; // Update the article file
      this.selectedArticleFile = null; // Clear selected file after upload
      this.closeModal('uploadArticleFileModal'); // Close the modal
      alert('Final article file uploaded successfully!');
      this.saveAllChanges(); // Trigger a save after upload
    } else {
      alert('No file selected to upload.');
    }
  }

  // --- Author Management Functions ---

  /**
   * Adds a new empty author to the list.
   */
  addAuthor(): void {
    if (this.manuscript) {
      if (!this.manuscript.authors) {
        this.manuscript.authors = [];
      }
      this.manuscript.authors.push({ name: '', affiliation: '', email: '' });
    }
  }

  /**
   * Removes an author from the list by index.
   */
  removeAuthor(index: number): void {
    if (this.manuscript && this.manuscript.authors) {
      if (confirm('Are you sure you want to remove this author?')) {
        this.manuscript.authors.splice(index, 1);
      }
    }
  }

  // --- Publication Action Functions ---

  /**
   * Opens the confirmation modal for various publication actions.
   */
  openPublicationActionModal(action: string): void {
    this.currentAction = action;
    switch (action) {
      case 'publishArticle':
        this.confirmationMessage = 'Are you sure you want to publish this article? This action is irreversible.';
        break;
      case 'schedulePublication':
        this.confirmationMessage = 'Are you sure you want to schedule this article for publication?';
        break;
      case 'unpublishArticle':
        this.confirmationMessage = 'WARNING: Are you sure you want to unpublish this article? It will no longer be publicly accessible.';
        break;
      case 'requestCorrections':
        this.confirmationMessage = 'Are you sure you want to request corrections for the published article?';
        break;
      default:
        this.confirmationMessage = 'Are you sure you want to proceed with this action?';
        break;
    }
    this.openModal('publicationConfirmationModal');
  }

  /**
   * Executes the confirmed publication action.
   */
  confirmPublicationAction(): void {
    console.log(`Confirmed publication action: ${this.currentAction}`);
    // Implement the actual logic for each action here
    if (this.manuscript) {
      switch (this.currentAction) {
        case 'publishArticle':
          this.manuscript.publicationStatus = 'Published';
          alert('Article published successfully!');
          break;
        case 'schedulePublication':
          this.manuscript.publicationStatus = 'Scheduled';
          alert('Article scheduled for publication!');
          break;
        case 'unpublishArticle':
          this.manuscript.publicationStatus = 'Unpublished';
          alert('Article unpublished successfully!');
          break;
        case 'requestCorrections':
          alert('Request for corrections sent!');
          // Additional logic for sending notifications
          break;
      }
      this.saveAllChanges(); // Trigger a save after status change
    }
    this.closeModal('publicationConfirmationModal');
  }

  /**
   * Saves all changes made on the page to the manuscript object.
   * In a real application, this would send the updated manuscript object to a backend API.
   */
  saveAllChanges(): void {
    if (this.manuscript) {
      // Parse keywords string back into an array
      this.manuscript.keywords = this.keywordsString
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);

      console.log('Saving all changes to manuscript:', this.manuscript);
      alert('All changes saved successfully!');
      // In a real application:
      // this.http.put(`/api/manuscripts/${this.manuscript.id}`, this.manuscript).subscribe(
      //   response => {
      //     console.log('Manuscript updated on server', response);
      //     alert('All changes saved successfully!');
      //   },
      //   error => {
      //     console.error('Error saving manuscript', error);
      //     alert('Failed to save changes. Please try again.');
      //   }
      // );
    } else {
      alert('No manuscript data to save.');
    }
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