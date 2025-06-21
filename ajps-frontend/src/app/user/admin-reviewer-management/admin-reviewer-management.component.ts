import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

declare const bootstrap: any;

interface Reviewer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  assignedJournals: string[];
}

@Component({
  selector: 'app-admin-reviewer-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reviewer-management.component.html',
  styleUrls: ['./admin-reviewer-management.component.css']
})
export class AdminReviewerManagementComponent {
  reviewerSearchQuery: string = '';
  journalFilter: string = '';
  journals: string[] = ['Journal of Botany', 'Environmental Studies', 'Plant Diversity'];

  reviewers: Reviewer[] = [
    {
      id: 1,
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      assignedJournals: ['Journal of Botany', 'Plant Diversity']
    },
    {
      id: 2,
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob@example.com',
      assignedJournals: []
    }
  ];

  filteredReviewers: Reviewer[] = [...this.reviewers];

  selectedReviewer: Reviewer | null = null;
  journalSelections: { [journal: string]: boolean } = {};

  searchReviewers() {
    const query = this.reviewerSearchQuery.toLowerCase();

    this.filteredReviewers = this.reviewers.filter(reviewer => {
      const matchesQuery =
        reviewer.firstName.toLowerCase().includes(query) ||
        reviewer.lastName.toLowerCase().includes(query) ||
        reviewer.email.toLowerCase().includes(query);

      const matchesJournal =
        !this.journalFilter ||
        (this.journalFilter === '__UNASSIGNED__'
          ? reviewer.assignedJournals.length === 0
          : reviewer.assignedJournals.includes(this.journalFilter));

      return matchesQuery && matchesJournal;
    });
  }

  clearReviewerSearch() {
    this.reviewerSearchQuery = '';
    this.journalFilter = '';
    this.filteredReviewers = [...this.reviewers];
  }

  openEditAssignedJournals(reviewer: Reviewer) {
    this.selectedReviewer = reviewer;

    // Initialize checkbox selections
    this.journalSelections = {};
    this.journals.forEach(journal => {
      this.journalSelections[journal] = reviewer.assignedJournals.includes(journal);
    });

    const modal = new bootstrap.Modal(document.getElementById('editAssignedJournalsModal')!);
    modal.show();
  }

  saveAssignedJournals() {
    if (!this.selectedReviewer) return;

    const updatedAssignments = Object.keys(this.journalSelections)
      .filter(journal => this.journalSelections[journal]);

    this.reviewers = this.reviewers.map(r =>
      r.id === this.selectedReviewer!.id
        ? { ...r, assignedJournals: updatedAssignments }
        : r
    );

    this.filteredReviewers = [...this.reviewers];
    this.selectedReviewer = null;
    this.journalSelections = {};
  }
}
