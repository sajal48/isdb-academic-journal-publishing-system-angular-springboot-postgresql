import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthLoginRegisterService } from '../../../site-settings/auth/auth-login-register.service';
import { UserSubmissionDetailsService } from '../../../site-settings/submission/user-submission-details.service';
import { UserToastNotificationService } from '../../../site-settings/user-profile/user-toast-notification.service';
import { CommonModule } from '@angular/common';

interface AuthorDetails {
  name: string;
  email: string;
  institution: string;
  corresponding: boolean;
}

@Component({
  selector: 'app-submission-step-two',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './submission-step-two.component.html',
  styleUrl: '../user-submission.component.css'
})
export class SubmissionStepTwoComponent implements OnInit {
  userId: number = 0;
  submissionId: string | null = '';
  validationError: string = '';

  authors: AuthorDetails[] = [];
  
  authorDetails: AuthorDetails = {
    name: '',
    email: '',
    institution: '',
    corresponding: false
  };

  private fieldDisplayNames: { [key: string]: string } = {
    name: 'Author Name',
    email: 'Author Email',
    institution: 'Institution'
  };

  private emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(
    private userSubmissionDetailsService: UserSubmissionDetailsService,
    private authService: AuthLoginRegisterService,
    private userToastNotificationService: UserToastNotificationService,
    private router: Router
  ) {
    this.userId = authService.getUserID();
  }

  ngOnInit(): void {
    this.submissionId = this.userSubmissionDetailsService.getSubmissionId();

    if (this.submissionId) {
      this.loadAuthors();
    }
  }

  loadAuthors(): void {
    this.userSubmissionDetailsService.getManuscriptDetailsBySubmissionId(this.submissionId)
      .subscribe({
        next: (response) => {
          if (response.code === 200 && Array.isArray(response.data.authors)) {
            this.authors = response.data.authors.map((author: any) => ({
              name: author.name || '',
              email: author.email || '',
              institution: author.institution || '',
              corresponding: author.corresponding || false
            }));
          }
        },
        error: (err) => {
          console.error('Error loading authors:', err);
        }
      });
  }

  addAuthor() {
    // Check if all fields are filled
    if (!this.authorDetails.name || !this.authorDetails.email || !this.authorDetails.institution) {
      this.validationError = 'Please fill out all author fields.';
      this.userToastNotificationService.showToast('Error', this.validationError, 'danger');
      return;
    }

    // Validate email format
    if (!this.emailRegex.test(this.authorDetails.email)) {
      this.validationError = 'Please enter a valid email address.';
      this.userToastNotificationService.showToast('Error', this.validationError, 'danger');
      return;
    }

    // Check if another author is already marked as corresponding
    if (this.authorDetails.corresponding && this.authors.some(author => author.corresponding)) {
      this.validationError = 'Only one author can be marked as the corresponding author.';
      this.userToastNotificationService.showToast('Error', this.validationError, 'danger');
      return;
    }
    
    const payload = {
      submissionId: this.submissionId,
      authors: [{ ...this.authorDetails }] // Send as array with single author
    };

    this.userSubmissionDetailsService.saveAuthorInformations(payload).subscribe({
      next: (response) => {
        if (response.code === 200 || response.code === 201) {
          this.authors.push({ ...this.authorDetails });
          this.authorDetails = { name: '', email: '', institution: '', corresponding: false };
          this.validationError = '';
          this.userToastNotificationService.showToast('Success', 'Author added successfully.', 'success');
        } else {
          this.userToastNotificationService.showToast('Error', 'Failed to add author.', 'danger');
        }
      },
      error: (error) => {
        console.error(error);
        this.userToastNotificationService.showToast('Error', 'An error occurred while adding author.', 'danger');
      }
    });
  }

  removeAuthor(index: number) {
    const authorToRemove = this.authors[index];
    
    this.userSubmissionDetailsService.removeAuthor(this.submissionId, authorToRemove.email).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.authors.splice(index, 1);
          this.userToastNotificationService.showToast('Success', 'Author removed successfully.', 'success');
        } else {
          this.userToastNotificationService.showToast('Error', 'Failed to remove author.', 'danger');
        }
      },
      error: (error) => {
        console.error(error);
        this.userToastNotificationService.showToast('Error', 'An error occurred while removing author.', 'danger');
      }
    });
  }

  onSubmit(form: NgForm): boolean {
    if (this.authors.length < 1 || !this.authors.some(author => author.corresponding)) {
      this.userToastNotificationService.showToast('Error', 'Add at least one corresponding author.', 'danger');
      return false;
    }
    
    const payload = {
      submissionId: this.submissionId,
      completedSteps: ["author-informations"] // Mark this step as completed
    };

    this.userSubmissionDetailsService.updateSubmissionSteps(payload).subscribe({
      next: (response) => {
        if (response.code === 200) {
          this.userToastNotificationService.showToast('Success', 'Author information saved successfully.', 'success');
          this.router.navigate(['/user/submission/manuscript-upload']);
        } else {
          this.userToastNotificationService.showToast('Error', 'Failed to save author informations.', 'danger');
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