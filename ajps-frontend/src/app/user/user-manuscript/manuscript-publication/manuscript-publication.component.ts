import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

// --- Interfaces ---
interface CustomFile {
  id?: string;
  name: string;
  size: number; // in bytes
  url: string;
  isProductionFile?: boolean;
  fileOrigin?: string;
}

interface Author {
  name: string;
  affiliation: string;
  email: string;
  orcid?: string; // ORCID is optional
}

interface User {
  userId: string;
}

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
}

interface Manuscript {
  id: string;
  title: string;
  keywords: string[];
  abstract: string;
  authors: Author[];
  doi?: string;
  articleFile: CustomFile | null;
  publicationStatus: 'Draft' | 'Scheduled' | 'Published' | 'Unpublished' | 'Publication';
  journalId?: string;
  volumeId?: string;
  issueId?: string;
  lastUpdated?: Date;
  files?: CustomFile[];
  owner: User;
}

@Component({
  selector: 'app-manuscript-publication',
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './manuscript-publication.component.html',
  styleUrl: './manuscript-publication.component.css'
})
export class ManuscriptPublicationComponent implements OnInit {

  manuscript: Manuscript | null = null;
  currentUserId: string = 'pub_admin123'; // Simulate current user ID

  selectedArticleFile: CustomFile | null = null;
  keywordsString: string = '';

  // For Journal/Volume/Issue Selection
  journals: Journal[] = [];
  volumes: Volume[] = [];
  issues: Issue[] = [];

  filteredVolumes: Volume[] = [];
  filteredIssues: Issue[] = [];

  selectedJournalId: string | null = null;
  selectedVolumeId: string | null = null;
  selectedIssueId: string | null = null;

  // For Publication Files
  productionReadyFiles: CustomFile[] = [];

  // For Modals
  confirmationMessage: string = '';
  currentAction: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadManuscriptDetails('manuscript123');
    this.loadPublicationData();
  }

  loadManuscriptDetails(manuscriptId: string): void {
    setTimeout(() => {
      this.manuscript = {
        id: manuscriptId,
        title: 'The Impact of AI on Modern Education Systems: A Longitudinal Study',
        keywords: ['Artificial Intelligence', 'Education', 'Technology', 'Learning Outcomes'],
        abstract: 'This study investigates the profound effects of integrating artificial intelligence (AI) technologies into primary and secondary education systems over a ten-year period...',
        authors: [
          { name: 'Dr. Jane Doe', affiliation: 'Department of Educational Technology, University of Global Studies', email: 'jane.doe@example.edu', orcid: '0000-0001-2345-6789' },
          { name: 'Prof. John Smith', affiliation: 'Faculty of Computer Science, Tech University', email: 'john.smith@example.com' }
        ],
        doi: '10.1234/journal.2025.12345',
        articleFile: { name: 'Final_Article_v1.0.pdf', size: 4500000, url: '/assets/final_article.pdf' },
        publicationStatus: 'Publication',
        lastUpdated: new Date(),
        files: [
          { id: 'file2', name: 'Production_Final.pdf', size: 4800000, url: '/assets/production_final.pdf', isProductionFile: true, fileOrigin: 'PRODUCTION' }
        ],
        owner: { userId: 'author456' }
      };

      this.keywordsString = this.manuscript.keywords ? this.manuscript.keywords.join(', ') : '';
      if (this.manuscript.journalId) this.selectedJournalId = this.manuscript.journalId;
      if (this.manuscript.volumeId) this.selectedVolumeId = this.manuscript.volumeId;
      if (this.manuscript.issueId) this.selectedIssueId = this.manuscript.issueId;

      this.filterFiles();
      this.onJournalChange();
      this.onVolumeChange();

      console.log('Manuscript loaded for publication:', this.manuscript);
    }, 500);
  }

  loadPublicationData(): void {
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

      if (this.manuscript?.journalId) {
        this.onJournalChange();
        if (this.manuscript?.volumeId) {
          this.onVolumeChange();
        }
      }
    }, 700);
  }

  filterFiles(): void {
    if (this.manuscript) {
      this.productionReadyFiles = this.manuscript.files?.filter(file => file.isProductionFile || file.fileOrigin === 'PRODUCTION') || [];
    }
  }

  onJournalChange(): void {
    this.filteredVolumes = this.selectedJournalId
      ? this.volumes.filter(v => v.journalId === this.selectedJournalId)
      : [];
    this.selectedVolumeId = null;
    this.selectedIssueId = null;
    this.filteredIssues = [];
  }

  onVolumeChange(): void {
    this.filteredIssues = this.selectedVolumeId
      ? this.issues.filter(i => i.volumeId === this.selectedVolumeId)
      : [];
    this.selectedIssueId = null;
  }

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
      this.saveAllChanges();
    } else {
      alert('Please select a Journal, Volume, and Issue.');
    }
  }

  downloadFile(url: string, fileName: string): void {
    console.log(`Downloading: ${fileName} from ${url}`);
    alert(`Initiating download for: ${fileName}`);
    window.open(url, '_blank');
  }

  onArticleFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedArticleFile = {
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file as Blob)
      };
      console.log('Final article file selected:', this.selectedArticleFile);
    } else {
      this.selectedArticleFile = null;
    }
  }

  uploadArticleFile(): void {
    if (this.selectedArticleFile && this.manuscript) {
      console.log('Uploading final article file:', this.selectedArticleFile.name);
      this.manuscript.articleFile = { ...this.selectedArticleFile };
      this.manuscript.files = this.manuscript.files || [];
      this.manuscript.files.push({ ...this.selectedArticleFile, isProductionFile: true, fileOrigin: 'PRODUCTION' });
      this.filterFiles();
      this.selectedArticleFile = null;
      this.closeModal('uploadArticleFileModal');
      alert('Final article file uploaded successfully!');
      this.saveAllChanges();
    } else {
      alert('No file selected to upload.');
    }
  }

  openPublicationActionModal(action: string): void {
    this.currentAction = action;
    switch (action) {
      case 'publishArticle':
        this.confirmationMessage = 'Are you sure you want to publish this article?';
        break;
      case 'unpublishArticle':
        this.confirmationMessage = 'WARNING: Are you sure you want to unpublish this article?';
        break;
      default:
        this.confirmationMessage = 'Are you sure you want to proceed with this action?';
        break;
    }
    this.openModal('publicationConfirmationModal');
  }

  confirmPublicationAction(): void {
    console.log(`Confirmed publication action: ${this.currentAction}`);
    if (this.manuscript) {
      switch (this.currentAction) {
        case 'publishArticle':
          this.manuscript.publicationStatus = 'Published';
          this.manuscript.lastUpdated = new Date();
          alert('Article published successfully!');
          break;
        case 'unpublishArticle':
          this.manuscript.publicationStatus = 'Unpublished';
          this.manuscript.lastUpdated = new Date();
          alert('Article unpublished successfully!');
          break;
      }
      this.saveAllChanges();
    }
    this.closeModal('publicationConfirmationModal');
  }

  saveAllChanges(): void {
    if (this.manuscript) {
      this.manuscript.keywords = this.keywordsString
        .split(',')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);

      console.log('Saving all changes to manuscript:', this.manuscript);
      alert('All changes saved successfully!');
    } else {
      alert('No manuscript data to save.');
    }
  }

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