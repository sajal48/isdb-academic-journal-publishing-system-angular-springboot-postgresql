// submission-view.component.ts
import { CommonModule, TitleCasePipe, DecimalPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserSubmissionDetailsService } from '../../../site-settings/submission/user-submission-details.service';
import { UserToastNotificationService } from '../../../site-settings/toast-popup/user-toast-notification.service';
import { HttpClient } from '@angular/common/http';

// Interfaces for the backend response structure
interface Journal {
  journalName: string;
  id: number;
}

interface FileDetails {
  id: number;
  fileOrigin: string;
  storedName: string;
  originalName: string;
  size: number;
  type: string;
  fileUrl: string;
}

interface Reviewer {
  id: number;
  name: string;
  email: string;
  institution: string;
}

interface Author {
  id: number;
  name: string;
  email: string;
  institution: string;
  corresponding: boolean;
}

// Unified Backend Response Interface
interface BackendResponse {
    code: number;
    status: string;
    message?: string;
    data?: SubmissionResponseData;
}

interface SubmissionResponseData {
  submissionNumber: number;
  manuscriptCategory: string;
  manuscriptKeywords: string;
  comments?: string; // Made optional
  submissionConfirmation: boolean;
  abstractContent: string;
  completedSteps: string;
  createdAt: string;
  journal?: Journal; // Made optional
  submissionStatus: string;
  isEditable: boolean;
  isPaymentDue: boolean;
  files?: FileDetails[]; // Made optional
  manuscriptTitle: string;
  id: number;
  submittedAt?: string; // Made optional
  submissionReviewers?: Reviewer[]; // Made optional
  updatedAt?: string; // Made optional
  authors?: Author[]; // Made optional
}

@Component({
  selector: 'app-submission-view',
  standalone: true,
  imports: [CommonModule, TitleCasePipe, DecimalPipe, DatePipe],
  templateUrl: './submission-view.component.html',
  styleUrl: './submission-view.component.css'
})
export class SubmissionViewComponent implements OnInit {

  submissionDetails: SubmissionResponseData | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private userSubmissionDetailsService: UserSubmissionDetailsService,
    private userToastNotificationService: UserToastNotificationService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const submissionId = this.userSubmissionDetailsService.getSubmissionId();

    if (submissionId !== null) {
      this.fetchSubmissionDetails(submissionId);
    } else {
      this.error = 'Submission ID not found. Please select a manuscript from the dashboard.';
      this.isLoading = false;
      this.userToastNotificationService.showToast('Error', this.error, 'danger');
      // Optionally navigate back to dashboard if no ID is found
      // this.router.navigate(['/user/dashboard']);
    }
  }

  /**
   * Fetches the submission details from the backend.
   * @param id The ID of the submission to fetch.
   */
  fetchSubmissionDetails(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.userSubmissionDetailsService.getManuscriptDetailsBySubmissionId(id).subscribe({
      next: (response: BackendResponse) => {
        if (response.code === 200 && response.status === 'success' && response.data) {
          this.submissionDetails = response.data;
        } else {
          this.error = response.message || 'Failed to load submission details.';
          this.userToastNotificationService.showToast('Error', this.error, 'danger');
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching submission details:', err);
        this.error = 'An unexpected error occurred while fetching details.';
        this.userToastNotificationService.showToast('Error', this.error, 'danger');
        this.isLoading = false;
      }
    });
  }

  /**
   * Navigates back to the user dashboard and clears the stored submission ID.
   */
  goBack(): void {
    this.userSubmissionDetailsService.clearSubmissionId();
    this.router.navigate(['/user/dashboard']);
  }

  downloadFile(fileUrl: string, originalFileName: string): void {
    this.isLoading = true;

    const downloadUrl = fileUrl;

    this.http.get(downloadUrl, { responseType: 'blob' })
      .subscribe({
        next: (response: Blob) => {
          // Create a blob URL and trigger the download
          const blob = new Blob([response], { type: response.type });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = originalFileName; // Use the original file name
          document.body.appendChild(a); // Append to body (required for Firefox)
          a.click(); // Programmatically click the link to trigger download
          window.URL.revokeObjectURL(url); // Clean up the URL object

          this.isLoading = false; // Re-enable buttons
        },
        error: (error: any) => {
          // console.error('Error downloading file:', error);
          // alert('Failed to download file. Please try again.');
          this.userToastNotificationService.showToast('Error', 'Failed to download file. Please try again.', 'danger');
          this.isLoading = false; // Re-enable buttons even on error
        }
      });
  }

  /**
   * Returns Bootstrap badge classes based on the submission status for styling.
   */
  getSubmissionStatusBadgeClass(status: string): string {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-info text-dark';
      case 'UNDER_REVIEW':
        return 'bg-warning text-dark';
      case 'REVISION_REQUIRED':
        return 'bg-danger';
      case 'ACCEPTED':
        return 'bg-success';
      case 'PUBLISHED':
        return 'bg-primary';
      case 'SAVED':
        return 'bg-secondary';
      case 'DUE_PAYMENT':
        return 'bg-dark';
      default:
        return 'bg-light text-muted border';
    }
  }
}