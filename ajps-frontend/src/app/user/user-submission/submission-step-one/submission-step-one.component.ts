import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserSubmissionDetailsService } from '../../../site-settings/submission/user-submission-details.service';
import { AuthLoginRegisterService } from '../../../site-settings/auth/auth-login-register.service';

@Component({
  selector: 'app-submission-step-one',
  imports: [RouterLink],
  templateUrl: './submission-step-one.component.html',
  styleUrl: '../user-submission.component.css'
})
export class SubmissionStepOneComponent {
   manuscript = {
    journalName: '',
    manuscriptTitle: '',
    manuscriptCategory: '',
    abstractContent: '',
    manuscriptKeywords: ''
  };

  errorMessage = '';
  successMessage = '';

  constructor(
    private submissionService: UserSubmissionDetailsService,
    private authService: AuthLoginRegisterService
  ) {}

}
