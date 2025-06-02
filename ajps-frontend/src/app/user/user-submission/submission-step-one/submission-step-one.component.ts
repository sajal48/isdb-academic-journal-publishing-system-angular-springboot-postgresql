import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserSubmissionDetailsService } from '../../../site-settings/submission/user-submission-details.service';
import { AuthLoginRegisterService } from '../../../site-settings/auth/auth-login-register.service';
import { FormsModule, NgForm } from '@angular/forms';
import { UserToastNotificationService } from '../../../site-settings/user-profile/user-toast-notification.service';

interface ManuscriptDetails {
  journalName: string;
  manuscriptTitle: string;
  manuscriptCategory: string;
  abstractContent: string;
  manuscriptKeywords: string;
  completedSteps: string;
}

@Component({
  selector: 'app-submission-step-one',
  imports: [FormsModule],
  templateUrl: './submission-step-one.component.html',
  styleUrl: '../user-submission.component.css'
})
export class SubmissionStepOneComponent {
  userId = 0;
  
  validationError: string = '';

  manuscript: ManuscriptDetails = {
    journalName: '',
    manuscriptTitle: '',
    manuscriptCategory: '',
    abstractContent: '',
    manuscriptKeywords: '',
    completedSteps: 'manuscript-details'
  };
  
  private fieldDisplayNames: { [key: string]: string } = {
    journalName: 'Journal',
    manuscriptTitle: 'Manuscript Title',
    manuscriptCategory: 'Manuscript Category',
    abstractContent: 'Abstract',
    manuscriptKeywords: 'Keywords'
  };

  constructor(
    private submissionService: UserSubmissionDetailsService,
    private authService: AuthLoginRegisterService,
    private userToastNotificationService: UserToastNotificationService

  ) {
    this.userId = authService.getUserID();
  }

  private validateForm(): boolean {
    this.validationError = ''; // Clear previous errors

    // Define the list of required fields to check
    const requiredFields: (keyof ManuscriptDetails)[] = [
      'journalName',
      'manuscriptTitle',
      'manuscriptCategory',
      'abstractContent',
      'manuscriptKeywords'
    ];

    for (const field of requiredFields) {
      const displayName = this.fieldDisplayNames[field] || field; 

      if (typeof this.manuscript[field] === 'string' && (this.manuscript[field] as string).trim() === '') {
        this.validationError = `Please fill out the '${displayName}' field.`;
        return false;
      }
      
    }

    return true;
  }

  onSubmit(form: NgForm): void {
    if (!this.validateForm()) {
      this.userToastNotificationService.showToast('Error', `${this.validationError}`, 'danger');
      return;
    }

    const payload = {
      userId: this.userId,
      ...this.manuscript
    };

    this.submissionService.saveManuscriptDetails(payload).subscribe({
      next: (response) => {
        if (response.code === 200 || response.code === 201) {
          this.userToastNotificationService.showToast('Success', `${response.message}`, 'success');

        } else {
          this.userToastNotificationService.showToast('Error', `${response.message}`, 'danger');
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
