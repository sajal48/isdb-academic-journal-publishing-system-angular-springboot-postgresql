import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthLoginRegisterService } from '../../../site-settings/auth/auth-login-register.service';
import { UserSubmissionDetailsService } from '../../../site-settings/submission/user-submission-details.service';
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
  selector: 'app-submission-step-two',
  imports: [RouterLink, FormsModule],
  templateUrl: './submission-step-two.component.html',
  styleUrl: '../user-submission.component.css'
})
export class SubmissionStepTwoComponent implements OnInit {

  userId: number = 0;
  submissionId: number = 0;
  
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
    // console.log(this.submissionService.getSubmissionId());
    
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

  onSubmit(form: NgForm): boolean {
    if (!this.validateForm()) {
      this.userToastNotificationService.showToast('Error', `${this.validationError}`, 'danger');
      return false;
    }

    const payload = {
      userId: this.userId,
      ...this.manuscript
    };

    this.userSubmissionDetailsService.saveManuscriptDetails(payload).subscribe({
      next: (response) => {
        if (response.code === 200 || response.code === 201) {
          this.userToastNotificationService.showToast('Success', `${response.message}`, 'success');
          this.submissionId = response.submissionId;
          debugger
          return true;

        } else {
          this.userToastNotificationService.showToast('Error', `${response.message}`, 'danger');
          return false
        }
      },
      error: (error) => {
        console.error(error);
        return false;
      }
    });
    return true;
  }

  onSaveAndExit(form: NgForm) {
    if (this.onSubmit(form)) {
      // window.location.href="/user/dashboard";
      this.router.navigate(['/user/dashboard']);
    }
  }

}
