import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserSubmissionDetailsService } from '../../../site-settings/submission/user-submission-details.service';
import { AuthLoginRegisterService } from '../../../site-settings/auth/auth-login-register.service';
import { FormsModule, NgForm } from '@angular/forms';
import { UserToastNotificationService } from '../../../site-settings/toast-popup/user-toast-notification.service';
import { Journal, JournalOperationsService } from '../../../site-settings/admin/journal-operations.service';
import { CommonModule } from '@angular/common';

interface ManuscriptDetails {
  journalId: number | null;
  manuscriptTitle: string;
  manuscriptCategory: string;
  abstractContent: string;
  manuscriptKeywords: string;
  completedSteps: string;
}

@Component({
  selector: 'app-submission-step-one',
  imports: [FormsModule, CommonModule],
  templateUrl: './submission-step-one.component.html',
  styleUrl: '../user-submission.component.css'
})
export class SubmissionStepOneComponent implements OnInit {
  userId: number = 0;
  validationError: string = '';

  journals: Journal[] = [];

  manuscript: ManuscriptDetails = {
    journalId: null,
    manuscriptTitle: '',
    manuscriptCategory: '',
    abstractContent: '',
    manuscriptKeywords: '',
    completedSteps: 'manuscript-details'
  };

  private fieldDisplayNames: { [key: string]: string } = {
    journalId: 'journal name',
    manuscriptTitle: 'manuscript title',
    manuscriptCategory: 'manuscript category',
    abstractContent: 'abstract',
    manuscriptKeywords: 'keywords'
  };

  constructor(
    private userSubmissionDetailsService: UserSubmissionDetailsService,
    private authService: AuthLoginRegisterService,
    private userToastNotificationService: UserToastNotificationService,
    private router: Router,
    private journalOperations: JournalOperationsService
  ) {
    this.userId = authService.getUserID();
  }

  ngOnInit(): void {
    // Load available journals first
    this.journalOperations.getAll().subscribe({
      next: (data) => {
        this.journals = data;
        // After journals are loaded, attempt to load submission details
        this.loadSubmissionDetails();
      },
      error: (err) => {
        console.error('Failed to load journals', err);
        this.userToastNotificationService.showToast('Error', 'Failed to load journals.', 'danger');
      }
    });
  }

  // New method to encapsulate submission details loading
  private loadSubmissionDetails(): void {
    const existingSubmissionId = this.userSubmissionDetailsService.getSubmissionId();
    if (existingSubmissionId) {
      this.userSubmissionDetailsService.getManuscriptDetailsBySubmissionId(existingSubmissionId)
        .subscribe({
          next: (response) => {
            if (response.code === 200 && response.data) {
              const data = response.data;
              this.manuscript = {
                // Correctly set journalId from the nested 'journal' object
                // Ensure data.journal exists and has an id property
                journalId: data.journal ? data.journal.id : null,
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
            this.userToastNotificationService.showToast('Error', 'Failed to load manuscript details.', 'danger');
          }
        });
    }
  }

  private validateForm(): boolean {
    this.validationError = '';

    const requiredFields: (keyof ManuscriptDetails)[] = [
      'journalId',
      'manuscriptTitle',
      'manuscriptCategory',
      'abstractContent',
      'manuscriptKeywords'
    ];

    for (const field of requiredFields) {
      const displayName = this.fieldDisplayNames[field] || field;

      if (field === 'journalId') {
        if (this.manuscript.journalId === null || this.manuscript.journalId === 0) {
          this.validationError = `Please enter ${displayName}.`;
          return false;
        }
      } else if (typeof this.manuscript[field] === 'string' && (this.manuscript[field] as string).trim() === '') {
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
      journalId: this.manuscript.journalId,
      manuscriptTitle: this.manuscript.manuscriptTitle,
      manuscriptCategory: this.manuscript.manuscriptCategory,
      abstractContent: this.manuscript.abstractContent,
      manuscriptKeywords: this.manuscript.manuscriptKeywords,
      completedSteps: this.manuscript.completedSteps
    };

    const request = existingSubmissionId
      ? this.userSubmissionDetailsService.updateManuscriptDetails(payload)
      : this.userSubmissionDetailsService.saveManuscriptDetails(payload);

    request.subscribe({
      next: (response) => {
        if (response.code === 200 || response.code === 201) {
          this.userToastNotificationService.showToast('Success', `${response.message}`, 'success');

          if (!existingSubmissionId && response.data && response.data.submissionId) {
            this.userSubmissionDetailsService.setSubmissionId(response.data.submissionId);
          }

          setTimeout(() => {
            window.location.href = "/user/submission/author-informations";
          }, 500);
        } else {
          this.userToastNotificationService.showToast('Error', `${response.message}`, 'danger');
        }
      },
      error: (error) => {
        console.error('Submission error:', error);
        this.userToastNotificationService.showToast('Error', 'An error occurred during submission. Please try again.', 'danger');
      }
    });
  }

  exitToDashboard(): void {
    this.userSubmissionDetailsService.clearSubmissionId();
    this.router.navigate(['/user/dashboard']);
  }
}