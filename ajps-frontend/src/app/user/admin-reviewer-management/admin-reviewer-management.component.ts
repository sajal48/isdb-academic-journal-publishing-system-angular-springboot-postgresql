import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalOperationsService } from '../../site-settings/admin/journal-operations.service';
import { ReviewerOperationsService } from '../../site-settings/admin/reviewer-operations.service';
import { UserToastNotificationService } from '../../site-settings/toast-popup/user-toast-notification.service';

declare const bootstrap: any;

interface JournalShort {
  id: number;
  title: string;
}

interface Reviewer {
  authId: number;
  profileId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  assignedJournals: JournalShort[];
}

@Component({
  selector: 'app-admin-reviewer-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-reviewer-management.component.html',
  styleUrls: ['./admin-reviewer-management.component.css']
})
export class AdminReviewerManagementComponent implements OnInit {
  reviewerSearchQuery: string = '';
  journalFilter: string = '';
  journals: JournalShort[] = [];

  reviewers: Reviewer[] = [];
  filteredReviewers: Reviewer[] = [];

  selectedReviewer: Reviewer | null = null;
  journalSelections: { [journalId: number]: boolean } = {};

  constructor(
    private journalService: JournalOperationsService,
    private reviewerService: ReviewerOperationsService,
    private userToastNotificationService: UserToastNotificationService

  ) {}

  ngOnInit() {
    this.loadJournals();
    this.loadReviewers();
  }

  loadJournals() {
    this.journalService.getAll().subscribe((data: any[]) => {
      this.journals = data.map(j => ({ id: j.id, title: j.journalName }));
    });
  }

  loadReviewers() {
    this.reviewerService.getAllReviewers().subscribe((data: any[]) => {
      this.reviewers = data.map((item: any) => ({
        authId: item.authId,
        profileId: item.profileId,
        firstName: item.firstName,
        middleName: item.middleName,
        lastName: item.lastName,
        email: item.email,
        assignedJournals: item.assignedJournals || []
      }));
      this.filteredReviewers = [...this.reviewers];
    });
  }

  searchReviewers() {
    const query = this.reviewerSearchQuery.toLowerCase();
    this.filteredReviewers = this.reviewers.filter(reviewer => {
      const matchesQuery =
        reviewer.firstName?.toLowerCase().includes(query) ||
        reviewer.lastName?.toLowerCase().includes(query) ||
        reviewer.email?.toLowerCase().includes(query);

      const matchesJournal =
        !this.journalFilter ||
        (this.journalFilter === '__UNASSIGNED__'
          ? reviewer.assignedJournals.length === 0
          : reviewer.assignedJournals.some(j => j.title === this.journalFilter));

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
    this.journalSelections = {};
    this.journals.forEach(journal => {
      this.journalSelections[journal.id] = reviewer.assignedJournals.some(j => j.id === journal.id);
    });

    const modal = new bootstrap.Modal(document.getElementById('editAssignedJournalsModal')!);
    modal.show();
  }

  saveAssignedJournals() {
  if (!this.selectedReviewer) return;

  const selectedIds = Object.keys(this.journalSelections)
    .filter(id => this.journalSelections[+id])
    .map(id => +id);

  this.reviewerService.assignJournalsToReviewer(this.selectedReviewer.profileId, selectedIds).subscribe({
    next: () => {
      this.userToastNotificationService.showToast('Success', 'Journals assigned successfully', 'success');
      this.loadReviewers(); // reload data
    },
    error: () => {
      this.userToastNotificationService.showToast('Error', 'Failed to assign journals', 'danger');
    }
  });

  this.selectedReviewer = null;
  this.journalSelections = {};
}


  getJournalTitles(reviewer: Reviewer): string {
    return reviewer.assignedJournals && reviewer.assignedJournals.length
      ? reviewer.assignedJournals.map(j => j.title).join(', ')
      : '--';
  }
}
