import { Component } from '@angular/core';
import { ManuscriptSubmission } from '../../../site-settings/interface/submission-manuscript-submission-model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ManuscriptSubmissionService } from '../../../site-settings/submission/manuscript-submission.service';
import { UserToastNotificationService } from '../../../site-settings/user-profile/user-toast-notification.service';

@Component({
  selector: 'app-online-submission-fullpage',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './online-submission-fullpage.component.html',
  styleUrl: '../user-submission.component.css'
})
export class OnlineSubmissionFullpageComponent {

  manuscript: ManuscriptSubmission = {
    journal: '',
    articleTitle: '',
    articleCategory: '',
    abstractContent: '',
    keywords: '',
    correspondingAuthor: '',
    authorEmail: '',
    institution: '',
    manuscriptFile: null, // This will hold the Base64 string
    fileName: null, // Stores the original file name
    reviewers: [
      { name: '', email: '', institution: '' }, // Reviewer 1
      { name: '', email: '', institution: '' }  // Reviewer 2
    ],
    comments: ''
  };

  selectedFileName: string = '';
  validationError: string = '';
  isReadingFile: boolean = false; // To show a loading indicator while reading file

  // Define a mapping from field keys to display names for user-friendly error messages
  private fieldDisplayNames: { [key: string]: string } = {
    journal: 'Journal',
    articleTitle: 'Article Title',
    articleCategory: 'Article Category',
    abstractContent: 'abstract Content',
    keywords: 'Keywords',
    correspondingAuthor: 'Corresponding Author',
    authorEmail: 'Author Email',
    institution: 'Institution'
  };

  constructor(
    private manuscriptSubmissionService: ManuscriptSubmissionService,
    private userToastNotificationService: UserToastNotificationService
  ) { }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.validationError = ''; // Clear previous error

    if (file) {
      this.isReadingFile = true; // Set loading state
      const reader = new FileReader();

      reader.onload = (e: any) => {
        // The result will be a Base64 encoded string (Data URL)
        this.manuscript.manuscriptFile = e.target.result as string;
        this.selectedFileName = file.name;
        this.manuscript.fileName = file.name; // Store original file name in manuscript object
        this.isReadingFile = false; // Clear loading state
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        this.userToastNotificationService.showToast('File Error', 'Could not read the selected file.', 'danger');
        this.manuscript.manuscriptFile = null;
        this.selectedFileName = '';
        this.manuscript.fileName = null;
        this.isReadingFile = false; // Clear loading state on error
      };

      reader.readAsDataURL(file); // Read the file as a Data URL (Base64)
    } else {
      this.manuscript.manuscriptFile = null;
      this.selectedFileName = '';
      this.manuscript.fileName = null;
    }
  }

  private validateForm(): boolean {
    this.validationError = ''; // Clear previous errors

    // Define the list of required fields to check
    const requiredFields: (keyof ManuscriptSubmission)[] = [
      'journal',
      'articleTitle',
      'articleCategory',
      'abstractContent',
      'keywords',
      'correspondingAuthor',
      'authorEmail',
      'institution'
    ];

    // Iterate over required fields and check for emptiness
    for (const field of requiredFields) {
      // Get the user-friendly display name for the current field
      const displayName = this.fieldDisplayNames[field] || field; // Fallback to field name if not found

      // Check if the field is a string and is empty after trimming whitespace
      if (typeof this.manuscript[field] === 'string' && (this.manuscript[field] as string).trim() === '') {
        this.validationError = `Please fill out the '${displayName}' field.`;
        return false;
      }
      // This condition catches cases where a non-string required field might be null/undefined.
      // The 'manuscriptFile' itself is checked separately below.
      if (this.manuscript[field] === null || this.manuscript[field] === undefined) {
         // Exclude 'fileName' from this generic null check as its emptiness is tied to manuscriptFile
         if (field !== 'fileName') {
            this.validationError = `Please fill out the '${displayName}' field.`;
            return false;
         }
      }
    }

    // Specific check for manuscript file upload (now a Base64 string)
    if (!this.manuscript.manuscriptFile) {
      this.validationError = 'Please upload a manuscript file.';
      return false;
    }

    // Check if at least two reviewers are provided
    if (this.manuscript.reviewers.length < 2) {
      this.validationError = 'At least two reviewers are required.';
      return false;
    }

    // Validate each reviewer's name and email
    for (let i = 0; i < this.manuscript.reviewers.length; i++) {
      const reviewer = this.manuscript.reviewers[i];
      if (reviewer.name.trim() === '' || reviewer.email.trim() === '') {
        this.validationError = `Please provide both name and email for Reviewer ${i + 1}.`;
        return false;
      }
      // Validate reviewer email format
      if (!this.isValidEmail(reviewer.email)) {
        this.validationError = `Please enter a valid email address for Reviewer ${i + 1}.`;
        return false;
      }
    }

    // Validate corresponding author's email format
    if (!this.isValidEmail(this.manuscript.authorEmail)) {
        this.validationError = 'Please enter a valid email address for the Corresponding Author.';
        return false;
    }

    return true; // All validation checks passed
  }

  
  private isValidEmail(email: string): boolean {
    // Simple regex for email validation (can be enhanced for stricter validation)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  submitManuscript() {
    // Prevent submission if file is still being read
    if (this.isReadingFile) {
      this.userToastNotificationService.showToast('Processing', 'Please wait, the manuscript file is still being read.', 'info');
      return;
    }

    // Perform client-side validation
    if (!this.validateForm()) {
      // Display validation error using toast notification
      this.userToastNotificationService.showToast('Validation Error', `${this.validationError}`, 'danger');
      return; // Stop submission if validation fails
    }

    // Send the entire manuscript object as JSON.
    // Angular's HttpClient will automatically stringify this object to JSON
    // and set the Content-Type header to application/json.
    this.manuscriptSubmissionService.submitManuscript(this.manuscript).subscribe({
      next: (response) => {
        // On successful submission, show a success toast notification
        this.userToastNotificationService.showToast('Success', `Manuscript submitted successfully.`, 'success');
        setTimeout(() => {
          // window.location.reload();
          window.location.href="/user/dashboard";
        }, 2000);
        // Optionally, reset the form or navigate
        // this.resetForm();
      },
      error: (error) => {
        // On submission error, show an error toast notification
        console.error('Error submitting manuscript:', error);
        // Attempt to get a more specific error message from the backend response
        const errorMessage = error.error?.message || error.message || 'Submission failed. Please try again.';
        this.userToastNotificationService.showToast('Submission Error', errorMessage, 'danger');
      }
    });
  }
}
