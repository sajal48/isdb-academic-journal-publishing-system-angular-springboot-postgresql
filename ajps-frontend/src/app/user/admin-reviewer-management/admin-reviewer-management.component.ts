import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
declare const bootstrap: any;

interface Reviewer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  assignedJournals: string[];
  status: 'Active' | 'Suspended' | 'Deleted';
}

@Component({
  selector: 'app-admin-reviewer-management',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reviewer-management.component.html',
  styleUrl: './admin-reviewer-management.component.css'
})
export class AdminReviewerManagementComponent {

  reviewerSearchQuery: string = '';
  journalFilter: string = '';
  journals: string[] = ['Journal of Botany', 'Environmental Studies', 'Plant Diversity']; // example journals

  reviewers: Reviewer[] = [
    { id: 1, firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', assignedJournals: ['Journal of Botany', 'Plant Diversity'], status: 'Active' },
    { id: 2, firstName: 'Bob', lastName: 'Smith', email: 'bob@example.com', assignedJournals: [], status: 'Suspended' }
  ];

  filteredReviewers: Reviewer[] = [...this.reviewers];

  selectedReviewer: Reviewer | null = null;
  selectedJournal: string = '';

  searchReviewers() {
    const query = this.reviewerSearchQuery.toLowerCase();
    this.filteredReviewers = this.reviewers.filter(reviewer => {
      const matchesQuery =
        reviewer.firstName.toLowerCase().includes(query) ||
        reviewer.lastName.toLowerCase().includes(query) ||
        reviewer.email.toLowerCase().includes(query);

      const matchesJournal = !this.journalFilter || reviewer.assignedJournals.includes(this.journalFilter);

      return matchesQuery && matchesJournal;
    });
  }

  clearReviewerSearch() {
    this.reviewerSearchQuery = '';
    this.journalFilter = '';
    this.filteredReviewers = [...this.reviewers];
  }

  toggleSuspend(reviewer: Reviewer) {
    this.reviewers = this.reviewers.map(r =>
      r.id === reviewer.id
        ? { ...r, status: r.status === 'Active' ? 'Suspended' : 'Active' }
        : r
    );
    this.filteredReviewers = [...this.reviewers];
  }

  deleteUser(reviewer: Reviewer) {
    this.reviewers = this.reviewers.map(r =>
      r.id === reviewer.id ? { ...r, status: 'Deleted' } : r
    );
    this.filteredReviewers = [...this.reviewers];
  }

  openAssignModal(reviewer: Reviewer) {
    this.selectedReviewer = reviewer;
    this.selectedJournal = '';
    // Show modal using Bootstrap JS or Angular wrapper
    const modal = new bootstrap.Modal(document.getElementById('assignJournalModal')!);
    modal.show();
  }

  assignJournal() {
    if (this.selectedReviewer && this.selectedJournal) {
      const updatedReviewers = this.reviewers.map(r => {
        if (r.id === this.selectedReviewer!.id) {
          const alreadyAssigned = r.assignedJournals.includes(this.selectedJournal);
          return {
            ...r,
            assignedJournals: alreadyAssigned
              ? r.assignedJournals
              : [...r.assignedJournals, this.selectedJournal]
          };
        }
        return r;
      });

      this.reviewers = updatedReviewers;
      this.filteredReviewers = [...updatedReviewers];
    }

    this.selectedReviewer = null;
    this.selectedJournal = '';
  }

}
