import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthLoginRegisterService } from '../../../site-settings/auth/auth-login-register.service';
import { UserSubmissionDetailsService } from '../../../site-settings/submission/user-submission-details.service';
import { UserToastNotificationService } from '../../../site-settings/user-profile/user-toast-notification.service';
import { CommonModule } from '@angular/common';

interface ManuscriptDetails {
  journalName: string;
  manuscriptTitle: string;
  manuscriptCategory: string;
  abstractContent: string;
  manuscriptKeywords: string;
  completedSteps: string;
}

interface Author {
  name: string;
  email: string;
  institution: string;
  isCorresponding: boolean;
}

@Component({
  selector: 'app-submission-step-two',
  imports: [RouterLink, FormsModule, CommonModule],
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

  authors: Author[] = [];
  newAuthor: Author = {
    name: '',
    email: '',
    institution: '',
    isCorresponding: false
  };

  private fieldDisplayNames: { [key: string]: string } = {
    journalName: 'Journal Selection',
    manuscriptTitle: 'Manuscript Title',
    manuscriptCategory: 'Manuscript Category',
    abstractContent: 'Abstract',
    manuscriptKeywords: 'Keywords',
    authorName: 'Author Name',
    authorEmail: 'Author Email',
    authorInstitution: 'Institution/Organization'
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
    // Initialize component, potentially fetch existing submission data if needed
  }

  addAuthor() {
    if (this.newAuthor.name && this.newAuthor.email && this.newAuthor.institution) {
      // Check if another author is already marked as corresponding
      if (this.newAuthor.isCorresponding && this.authors.some(author => author.isCorresponding)) {
        this.validationError = 'Only one author can be marked as the corresponding author.';
        this.userToastNotificationService.showToast('Error', this.validationError, 'danger');
        return;
      }
      this.authors.push({ ...this.newAuthor });
      this.newAuthor = { name: '', email: '', institution: '', isCorresponding: false }; // Reset form
      this.validationError = '';
    } else {
      this.validationError = 'Please fill out all author fields.';
      this.userToastNotificationService.showToast('Error', this.validationError, 'danger');
    }
  }

  removeAuthor(index: number) {
    this.authors.splice(index, 1);
  }

  private validateForm(): boolean {
    this.validationError = ''; // Clear previous errors

    // Define the list of required manuscript fields to check
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

    // Validate that at least one author is added
    if (this.authors.length === 0) {
      this.validationError = 'Please add at least one author.';
      return false;
    }

    // Validate that exactly one author is marked as corresponding
    const correspondingAuthors = this.authors.filter(author => author.isCorresponding);
    if (correspondingAuthors.length !== 1) {
      this.validationError = 'Exactly one author must be marked as the corresponding author.';
      return false;
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
      ...this.manuscript,
      authors: this.authors
    };

    this.userSubmissionDetailsService.saveManuscriptDetails(payload).subscribe({
      next: (response) => {
        if (response.code === 200 || response.code === 201) {
          this.userToastNotificationService.showToast('Success', `${response.message}`, 'success');
          this.submissionId = response.submissionId;
          this.router.navigate(['/user/submission/manuscript-upload']);
          return true;
        } else {
          this.userToastNotificationService.showToast('Error', `${response.message}`, 'danger');
          return false;
        }
      },
      error: (error) => {
        console.error(error);
        this.userToastNotificationService.showToast('Error', 'An error occurred while submitting.', 'danger');
        return false;
      }
    });
    return true;
  }

  onSaveAndExit(form: NgForm) {
    if (this.onSubmit(form)) {
      this.router.navigate(['/user/dashboard']);
    }
  }
}