import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserSubmissionDetailsService } from '../../../site-settings/submission/user-submission-details.service';
import { UserToastNotificationService } from '../../../site-settings/toast-popup/user-toast-notification.service';
import { CommonModule } from '@angular/common';

interface ReviewerDetails {
  id: number;
  name: string;
  email: string;
  institution: string;
}

@Component({
  selector: 'app-submission-step-four',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './submission-step-four.component.html',
  styleUrl: '../user-submission.component.css'
})
export class SubmissionStepFourComponent implements OnInit {
  submissionId: number = 0;
  validationError: string = '';

  reviewers: ReviewerDetails[] = [];

  reviewerDetails: ReviewerDetails = {
    id: 0,
    name: '',
    email: '',
    institution: ''
  };

  private emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private userSubmissionDetailsService: UserSubmissionDetailsService,
    private userToastNotificationService: UserToastNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.submissionId = this.userSubmissionDetailsService.getSubmissionId();

    if (this.submissionId) {
      this.loadReviewers();
    }
  }

  loadReviewers(): void {
    this.userSubmissionDetailsService.getManuscriptDetailsBySubmissionId(this.submissionId)
      .subscribe({
        next: (response) => {
          if (response.code === 200 && Array.isArray(response.data.reviewers)) {
            this.reviewers = response.data.reviewers.map((reviewer: any) => ({
              id: reviewer.id || 0,
              name: reviewer.name || '',
              email: reviewer.email || '',
              institution: reviewer.institution || ''
            }));
          }
        },
        error: (err) => {
          console.error('Error loading reviewers:', err);
        }
      });
  }

  addReviewer() {
    if (!this.reviewerDetails.name || !this.reviewerDetails.email || !this.reviewerDetails.institution) {
      this.validationError = 'Please fill out all reviewer fields.';
      this.userToastNotificationService.showToast('Error', this.validationError, 'danger');
      return;
    }

    if (!this.emailRegex.test(this.reviewerDetails.email)) {
      this.validationError = 'Please enter a valid institutional email address.';
      this.userToastNotificationService.showToast('Error', this.validationError, 'danger');
      return;
    }

    const payload = {
      submissionId: this.submissionId,
      reviewers: [{ ...this.reviewerDetails }]
    };

    this.userSubmissionDetailsService.saveReviewerInformations(payload).subscribe({
      next: (response) => {
        if (response.code === 200 || response.code === 201) {
          const newReviewerId = response.data.reviewer[0].id;
          this.reviewers.push({ ...this.reviewerDetails, id: newReviewerId });
          this.reviewerDetails = { id: 0, name: '', email: '', institution: '' };
          this.validationError = '';
          this.userToastNotificationService.showToast('Success', 'Reviewer added successfully.', 'success');
        } else {
          this.userToastNotificationService.showToast('Error', 'Failed to add reviewer.', 'danger');
        }
      },
      error: (error) => {
        console.error(error);
        this.userToastNotificationService.showToast('Error', 'An error occurred while adding reviewer.', 'danger');
      }
    });
  }

  removeReviewer(index: number) {
    const reviewerId = this.reviewers[index].id;

    this.userSubmissionDetailsService.removeReviewer(this.submissionId, reviewerId).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.reviewers.splice(index, 1);
          this.userToastNotificationService.showToast('Success', 'Reviewer removed successfully.', 'success');
        } else {
          this.userToastNotificationService.showToast('Error', 'Failed to remove reviewer.', 'danger');
        }
      },
      error: (error) => {
        console.error(error);
        this.userToastNotificationService.showToast('Error', 'An error occurred while removing reviewer.', 'danger');
      }
    });
  }

  onSubmit(form: NgForm): boolean {
    if (this.reviewers.length < 2) {
      this.userToastNotificationService.showToast('Error', 'Provide at least two suggested reviewers.', 'danger');
      return false;
    }

    const payload = {
      submissionId: this.submissionId,
      completedSteps: ["suggested-reviewers"]
    };

    this.userSubmissionDetailsService.updateSubmissionSteps(payload).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.userToastNotificationService.showToast('Success', 'Reviewer information saved successfully.', 'success');
          setTimeout(() => {
            window.location.href = "/user/submission/additional-informations";
          }, 500);
        } else {
          this.userToastNotificationService.showToast('Error', 'Failed to save reviewer information.', 'danger');
        }
      },
      error: (error) => {
        console.error(error);
        this.userToastNotificationService.showToast('Error', 'An error occurred while saving.', 'danger');
      }
    });
    return true;
  }

  exitToDashboard(): void {
    this.userSubmissionDetailsService.clearSubmissionId();
    this.router.navigate(['/user/dashboard']);
  }
}
