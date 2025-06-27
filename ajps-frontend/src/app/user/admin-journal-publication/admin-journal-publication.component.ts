import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JournalPublicationOperationsService } from '../../site-settings/admin/journal-publication-operations.service';
import { Router } from '@angular/router';
import { UserToastNotificationService } from '../../site-settings/toast-popup/user-toast-notification.service';
import { PopupMessageService } from '../../site-settings/toast-popup/popup-message.service';

interface Journal {
  id: number;
  journalName: string;
}

interface Issue {
  id: number;
  volume: number;
  number: number;
  publicationDate: string;
  status: 'PUBLISHED' | 'FUTURE';
  papers: Paper[];
  // volumeNote?: string;
  // issueNote?: string;
}
export interface IssueRequest {
  id?: number;
  volume: number;
  number: number;
  publicationDate: string;
  status: 'PUBLISHED' | 'FUTURE';
}

interface Paper {
  id: number;
  title: string;
  authors: string;
  status: string;
}

@Component({
  selector: 'app-admin-journal-publication',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-journal-publication.component.html',
  styleUrls: ['./admin-journal-publication.component.css']
})
export class AdminJournalPublicationComponent implements OnInit, AfterViewInit {
  journals: Journal[] = [];
  selectedJournal: number | null = null;
  currentTab: 'published' | 'future' = 'published';
  selectedIssue: Issue | null = null;
  issues: Issue[] = [];

  newIssue: Partial<Issue> = this.getEmptyIssue();
  isEditingIssue = false;
  modalTitle = 'Add New Issue';

  private addIssueModalInstance: any;

  constructor(
    private journalService: JournalPublicationOperationsService,
    private router: Router,
    private toast: UserToastNotificationService,
    private popup: PopupMessageService
  ) { }

  ngOnInit(): void {
    this.journalService.getJournals().subscribe(data => this.journals = data);
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('addIssueModal');
    if (modalElement) {
      this.addIssueModalInstance = new (window as any).bootstrap.Modal(modalElement);
    }
  }

  loadIssues() {
    if (this.selectedJournal) {
      this.journalService.getIssues(this.selectedJournal).subscribe(data => {
        this.issues = data;
        this.selectedIssue = null;
      });
    }
  }

  getFilteredIssues(): Issue[] {
    return this.issues.filter(issue => issue.status === this.capitalize(this.currentTab));
  }

  capitalize(str: string): string {
    // return str.charAt(0).toUpperCase() + str.slice(1);
    return str.toUpperCase();
  }

  openAddIssueModal() {
    this.newIssue = this.getEmptyIssue();
    this.isEditingIssue = false;
    this.modalTitle = 'Add New Issue';

    if (this.addIssueModalInstance) {
      this.addIssueModalInstance.show();
    }
  }

  isIssueFormValid(): boolean {
    return !!(
      this.newIssue.volume &&
      this.newIssue.number &&
      this.newIssue.publicationDate &&
      this.newIssue.status
    );
  }

  submitNewIssue() {
    if (this.selectedJournal && this.isIssueFormValid()) {
      const issueRequest: IssueRequest = {
        id: this.newIssue.id!,
        volume: this.newIssue.volume!,
        number: this.newIssue.number!,
        publicationDate: this.newIssue.publicationDate!,
        status: this.newIssue.status!
      };

      const operation = this.isEditingIssue && this.newIssue.id
        ? this.journalService.updateIssue(issueRequest)
        : this.journalService.addIssue(this.selectedJournal, issueRequest);

      operation.subscribe({
        next: () => {
          this.loadIssues();
          if (this.addIssueModalInstance) {
            this.addIssueModalInstance.hide();
          }
          this.toast.showToast(
            this.isEditingIssue ? 'Updated' : 'Created',
            this.isEditingIssue ? 'Issue updated successfully.' : 'Issue added successfully.',
            'success'
          );
          this.resetIssueForm();
        },
        error: () => {
          this.toast.showToast('Error', this.isEditingIssue ? 'Failed to update issue.' : 'Failed to add issue.', 'danger');
        }
      });
    }
  }

  private resetIssueForm(): void {
    this.newIssue = this.getEmptyIssue();
    this.isEditingIssue = false;
    this.modalTitle = 'Add New Issue';

    // Also reset any dropdown/select default visually (not mandatory)
    const statusSelect = document.querySelector<HTMLSelectElement>('select[name="status"]');
    if (statusSelect) {
      statusSelect.selectedIndex = 0; // reset to placeholder/default
    }
  }

  viewPapers(issue: Issue) {
    this.selectedIssue = issue;
    const modal = new (window as any).bootstrap.Modal(document.getElementById('papersModal'));
    modal.show();
  }

  editIssue(issue: Issue) {
    this.newIssue = { ...issue };
    this.isEditingIssue = true;
    this.modalTitle = 'Edit Issue';

    if (this.addIssueModalInstance) {
      this.addIssueModalInstance.show();
    }
  }

  deleteIssue(issue: Issue) {
    this.popup.confirm('Delete Issue?', `Delete Volume ${issue.volume}, Issue ${issue.number} permanently?`, 'Yes, Delete', 'Cancel')
      .then(confirm => {
        if (confirm) {
          this.journalService.deleteIssue(issue.id).subscribe({
            next: () => {
              this.loadIssues();
              this.toast.showToast('Deleted', 'Issue deleted successfully.', 'success');
            },
            error: () => this.toast.showToast('Error', 'Delete failed', 'danger')
          });
        }
      });
  }

  editPaper(paper: Paper) {
    this.router.navigate(['/admin/papers/edit', paper.id]);
  }

  deletePaper(paper: Paper) {
    if (!this.selectedIssue) return;
    this.popup.confirm('Delete Paper?', `Are you sure you want to delete "${paper.title}"?`, 'Yes, Delete', 'Cancel')
      .then(confirm => {
        if (confirm) {
          this.journalService.deletePaper(this.selectedIssue!.id, paper.id).subscribe({
            next: () => {
              this.selectedIssue!.papers = this.selectedIssue!.papers.filter(p => p.id !== paper.id);
              this.toast.showToast('Deleted', 'Paper deleted successfully.', 'success');
            },
            error: () => this.toast.showToast('Error', 'Paper delete failed', 'danger')
          });
        }
      });
  }

  private getEmptyIssue(): Partial<Issue> {
    return {
      id: undefined,
      volume: undefined,
      number: undefined,
      publicationDate: '',
      status: undefined,
      // papers: [],
      // volumeNote: '',
      // issueNote: ''
    };
  }
}