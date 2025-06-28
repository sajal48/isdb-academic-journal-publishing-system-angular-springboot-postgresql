import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserSubmissionDetailsService } from '../../site-settings/submission/user-submission-details.service';

@Component({
  selector: 'app-admin-user-submissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-user-submissions.component.html',
  styleUrl: './admin-user-submissions.component.css'
})
export class AdminUserSubmissionsComponent implements OnInit {
  submissions: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private http: HttpClient, 
    private router: Router,
    private userSubmissionDetailsService: UserSubmissionDetailsService
  ) {}

  ngOnInit(): void {
    this.fetchSubmissions();
  }

  fetchSubmissions(): void {
    this.isLoading = true;
    this.userSubmissionDetailsService.getSubmissionListAll().subscribe({
      next: (response) => {
        this.submissions = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching submissions', error);
        this.errorMessage = 'Failed to load submissions. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  viewSubmission(submission: any): void {
    this.router.navigate([`/user/manuscript/${submission.id}/submission`], {
      queryParams: { userId: submission.userId }
    });
  }

  getSubmissionsByStatus(status: string) {
    return this.submissions.filter(sub => sub.submissionStatus === status);
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