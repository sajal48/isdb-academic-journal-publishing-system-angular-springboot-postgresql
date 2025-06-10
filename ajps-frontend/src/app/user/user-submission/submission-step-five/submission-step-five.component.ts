import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserSubmissionDetailsService } from '../../../site-settings/submission/user-submission-details.service';
import { UserToastNotificationService } from '../../../site-settings/user-profile/user-toast-notification.service';

interface AdditionalInfo {
  comment: string;
  submissionConfirmation: boolean;
}

@Component({
  selector: 'app-submission-step-five',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './submission-step-five.component.html',
  styleUrl: '../user-submission.component.css'
})
export class SubmissionStepFiveComponent implements OnInit {
  submissionId: number = 0;
  validationError: string = '';
  
  additionalInfo: AdditionalInfo = {
    comment: '',
    submissionConfirmation: false
  };

  constructor(
    private userSubmissionDetailsService: UserSubmissionDetailsService,
    private userToastNotificationService: UserToastNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.submissionId = this.userSubmissionDetailsService.getSubmissionId();
    this.loadAdditionalInfo();
  }

  private loadAdditionalInfo(): void {
    if (this.submissionId) {
      this.userSubmissionDetailsService.getManuscriptDetailsBySubmissionId(this.submissionId)
        .subscribe({
          next: (response) => {
            if (response.code === 200 && response.data) {
              this.additionalInfo = {
                comment: response.data.comments || '',
                submissionConfirmation: response.data.submissionConfirmation || false
              };
            }
          },
          error: (err) => {
            console.error('Error loading additional information:', err);
          }
        });
    }
  }

  onSubmit(form: NgForm): boolean {
    if (!this.additionalInfo.submissionConfirmation) {
      this.validationError = 'You must confirm the manuscript compliance.';
      this.userToastNotificationService.showToast('Error', this.validationError, 'danger');
      return false;
    }

    const payload = {
      submissionId: this.submissionId,
      comments: this.additionalInfo.comment,
      confirmed: this.additionalInfo.submissionConfirmation,
      completedSteps: ["additional-informations"]
    };

    this.userSubmissionDetailsService.saveAdditionalInformation(payload).subscribe({
      next: (response) => {
        if (response.code === 200 || response.code === 201) {
          this.userToastNotificationService.showToast('Success', 'Additional information saved successfully.', 'success');
          setTimeout(() => {
            // this.router.navigate(['/user/submission/submission-confirmation']);
            window.location.href="/user/submission/submission-confirmation";
          }, 500);
        } else {
          this.userToastNotificationService.showToast('Error', 'Failed to save additional information.', 'danger');
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