import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserSubmissionDetailsService } from '../../site-settings/submission/user-submission-details.service';

export interface SubmissionListAll {
  id: number;
  journalName: string;
  submissionNumber: number;
  manuscriptTitle: string;
  manuscriptCategory: string;
  submissionStatus: string;
  submittedAt: string;
  updatedAt: string;
  paymentDue: boolean;
  editable: boolean;
  userId: number;
}

@Component({
  selector: 'app-reviewer-dashboard-new',
  imports: [CommonModule],
  templateUrl: './reviewer-dashboard-new.component.html',
  styleUrl: './reviewer-dashboard-new.component.css'
})
export class ReviewerDashboardNewComponent implements OnInit {
  submissions: SubmissionListAll[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private userSubmissionDetailsService: UserSubmissionDetailsService
  ) { }

  ngOnInit(): void {
    this.fetchSubmissions();
  }

  fetchSubmissions(): void {
    this.isLoading = true;
    this.userSubmissionDetailsService.getSubmissionListAll().subscribe({
      next: (response) => {
        this.submissions = response.data;
        this.isLoading = false;
        // console.log(response);

      },
      error: (error) => {
        console.error('Error fetching submissions', error);
        this.errorMessage = 'Failed to load submissions. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  viewSubmission(submission: SubmissionListAll): void {
    this.router.navigate([`/user/manuscript/${submission.id}/review`], {
      queryParams: { userId: submission.userId }
    });
  }

  getSubmissionStatusColor(status: string): { 'background-color': string, color: string } {
    let bgColor = '#808080';
    let textColor = '#FFFFFF';

    switch (status) {
      case 'SAVED':
        bgColor = '#808080';
        break;
      case 'SUBMITTED':
        bgColor = '#4682B4';
        break;
      case 'UNDER_REVIEW':
        bgColor = '#FFD700';
        textColor = '#333333';
        break;
      case 'REVISION_REQUIRED':
        bgColor = '#FFA500';
        break;
      case 'ACCEPTED':
        bgColor = '#228B22';
        break;
      case 'DUE_PAYMENT':
        bgColor = '#DC143C';
        break;
      case 'COPY_EDITING':
        bgColor = '#1E90FF';
        break;
      case 'PUBLICATION':
        bgColor = '#8A2BE2';
        break;
      case 'PUBLISHED':
        bgColor = '#008000';
        break;
      case 'REJECTED':
        bgColor = '#BB2D3B';
        break;
      default:
        break;
    }
    return { 'background-color': bgColor, color: textColor };
  }
}
