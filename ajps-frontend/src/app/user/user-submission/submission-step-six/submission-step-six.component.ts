import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserSubmissionDetailsService } from '../../../site-settings/submission/user-submission-details.service';
import { UserToastNotificationService } from '../../../site-settings/user-profile/user-toast-notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-submission-step-six',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './submission-step-six.component.html',
  styleUrl: '../user-submission.component.css'
})
export class SubmissionStepSixComponent implements OnInit {
  submissionId: number = 0;
  validationError: string = '';

  constructor(
    private userSubmissionDetailsService: UserSubmissionDetailsService,
    private userToastNotificationService: UserToastNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.submissionId = this.userSubmissionDetailsService.getSubmissionId();
    if (!this.submissionId) {
      this.validationError = 'No submission ID found.';
      this.userToastNotificationService.showToast('Error', this.validationError, 'danger');
      this.router.navigate(['/user/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.submissionId) {
      this.userToastNotificationService.showToast('Error', 'Invalid submission ID.', 'danger');
      return;
    }

    const payload = {
      submissionId: this.submissionId,
      submissionStatus: 'SUBMITTED'
    };

    this.userSubmissionDetailsService.submitManuscript(payload).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.userToastNotificationService.showToast('Success', 'Manuscript submitted successfully.', 'success');
          this.userSubmissionDetailsService.clearSubmissionId();
          setTimeout(() => {
            this.router.navigate(['/user/dashboard']);
          }, 500);
        } else {
          this.userToastNotificationService.showToast('Error', 'Failed to submit manuscript.', 'danger');
        }
      },
      error: (error) => {
        console.error(error);
        this.userToastNotificationService.showToast('Error', 'An error occurred while submitting.', 'danger');
      }
    });
  }

  onSubmitLater(): void {
    this.userSubmissionDetailsService.clearSubmissionId();
    this.userToastNotificationService.showToast('Success', 'Submission saved as draft. Returning to dashboard.', 'success');
    this.router.navigate(['/user/dashboard']);
  }
}
