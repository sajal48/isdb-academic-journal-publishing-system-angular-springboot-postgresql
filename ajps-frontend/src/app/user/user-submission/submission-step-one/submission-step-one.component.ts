import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
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
export class SubmissionStepOneComponent implements OnInit {
  userId: number = 0;
  // submissionId: number = 0;
  
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
    journalName: 'Journal Selection',
    manuscriptTitle: 'Manuscript Title',
    manuscriptCategory: 'Manuscript Category',
    abstractContent: 'Abstract',
    manuscriptKeywords: 'Keywords'
  };

  constructor(
    private userSubmissionDetailsService: UserSubmissionDetailsService,
    private authService: AuthLoginRegisterService,
    private userToastNotificationService: UserToastNotificationService,
    private router: Router

  ) {
    this.userId = authService.getUserID();
  }

  ngOnInit(): void {
    const existingSubmissionId = this.userSubmissionDetailsService.getSubmissionId();
    if (existingSubmissionId) {
      this.userSubmissionDetailsService.getManuscriptDetailsBySubmissionId(existingSubmissionId)
        .subscribe({
          next: (response) => {
            if (response.code === 200 && response.data) {
              const data = response.data;
              this.manuscript = {
                journalName: data.journalName || '',
                manuscriptTitle: data.manuscriptTitle || '',
                manuscriptCategory: data.manuscriptCategory || '',
                abstractContent: data.abstractContent || '',
                manuscriptKeywords: data.manuscriptKeywords || '',
                completedSteps: data.completedSteps || 'manuscript-details'
              };
            }
          },
          error: (err) => {
            console.error('Error loading manuscript details:', err);
          }
        });
    }
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

    const existingSubmissionId = this.userSubmissionDetailsService.getSubmissionId();

    const payload = {
      userId: this.userId,
      submissionId: existingSubmissionId,
      ...this.manuscript
    };

    const request = existingSubmissionId
      ? this.userSubmissionDetailsService.updateManuscriptDetails(payload) // 👈 update request
      : this.userSubmissionDetailsService.saveManuscriptDetails(payload); // 👈 insert request

    request.subscribe({
      next: (response) => {
        if (response.code === 200 || response.code === 201) {
          this.userToastNotificationService.showToast('Success', `${response.message}`, 'success');

          if (!existingSubmissionId) {
            this.userSubmissionDetailsService.setSubmissionId(response.submissionId); // only set if insert
          }

          this.router.navigate(['/user/submission/author-informations']);
        } else {
          this.userToastNotificationService.showToast('Error', `${response.message}`, 'danger');
        }
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

  exitToDashboard(): void {
    this.userSubmissionDetailsService.clearSubmissionId();
    this.router.navigate(['/user/dashboard']);
  }

}
