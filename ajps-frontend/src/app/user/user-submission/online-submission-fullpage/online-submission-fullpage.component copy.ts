import { Component } from '@angular/core';
import { ManuscriptSubmission } from '../../../site-settings/interface/submission-manuscript-submission-model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ManuscriptSubmissionService } from '../../../site-settings/submission/manuscript-submission.service';
import { UserToastNotificationService } from '../../../site-settings/user-profile/user-toast-notification.service';

@Component({
  selector: 'app-online-submission-fullpage',
  standalone: true, // Ensure standalone is true if this is a standalone component
  imports: [FormsModule, CommonModule],
  templateUrl: './online-submission-fullpage.component.html',
  styleUrl: '../user-submission.component.css'
})
export class OnlineSubmissionFullpageComponent {

  manuscript: ManuscriptSubmission = {
    journal: '',
    articleTitle: '',
    articleCategory: '',
    abstract: '',
    keywords: '',
    correspondingAuthor: '',
    authorEmail: '',
    institution: '',
    manuscriptFile: null, // Initialize as null to hold the File object
    fileName: null,
    reviewers: [
      { name: '', email: '', institution: '' }, // Reviewer 1
      { name: '', email: '', institution: '' }  // Reviewer 2
    ],
    comments: ''
  };

  selectedFileName: string = '';
  validationError: string = '';

  // Define a mapping from field keys to display names for user-friendly error messages
  private fieldDisplayNames: { [key: string]: string } = {
    journal: 'Journal',
    articleTitle: 'Article Title',
    articleCategory: 'Article Category',
    abstract: 'Abstract',
    keywords: 'Keywords',
    correspondingAuthor: 'Corresponding Author',
    authorEmail: 'Author Email',
    institution: 'Institution'
  };

  constructor(
    private manuscriptSubmissionService: ManuscriptSubmissionService,
    private userToastNotificationService: UserToastNotificationService
  ) { }

  /**
   * Handles the file input change event.
   * Stores the selected file object and its name for display.
   * Clears any previous validation errors related to the file.
   * @param event The DOM event from the file input.
   */
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.manuscript.manuscriptFile = file; // Store the actual File object
      this.selectedFileName = file.name; // Store file name for display in the UI
    } else {
      this.manuscript.manuscriptFile = null; // Clear file if nothing selected
      this.selectedFileName = ''; // Clear file name display
    }
    this.validationError = ''; // Clear previous error when file changes
  }

  /**
   * Validates all required fields in the manuscript object.
   * Returns true if all required fields are filled and valid, false otherwise.
   * Sets validationError message if any field is blank or invalid.
   */
  private validateForm(): boolean {
    this.validationError = ''; // Clear previous errors

    // Define the list of required fields to check
    const requiredFields: (keyof ManuscriptSubmission)[] = [
      'journal',
      'articleTitle',
      'articleCategory',
      'abstract',
      'keywords',
      'correspondingAuthor',
      'authorEmail',
      // 'fileName', // fileName is derived from manuscriptFile, so direct check is not strictly needed here
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
      // This condition catches cases where a non-string required field might be null/undefined
      // (e.g., if we were checking a boolean or number that must not be null).
      // For manuscriptFile, a specific check is done below.
      if (this.manuscript[field] === null || this.manuscript[field] === undefined) {
         // Exclude 'fileName' from this generic null check as its emptiness is tied to manuscriptFile
         if (field !== 'fileName') {
            this.validationError = `Please fill out the '${displayName}' field.`;
            return false;
         }
      }
    }

    // Specific check for manuscript file upload
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

  /**
   * Helper function for basic email format validation.
   * @param email The email string to validate.
   * @returns True if the email format is valid, false otherwise.
   */
  private isValidEmail(email: string): boolean {
    // Simple regex for email validation (can be enhanced for stricter validation)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Initiates the manuscript submission process.
   * Performs client-side validation and then sends data to the service.
   */
  submitManuscript() {
    // Perform client-side validation
    if (!this.validateForm()) {
      // Display validation error using toast notification
      this.userToastNotificationService.showToast('Validation Error', `${this.validationError}`, 'danger');
      return; // Stop submission if validation fails
    }

    // Create a FormData object to handle file uploads and other form data
    const formData = new FormData();

    // Append all text fields from the manuscript object to FormData
    formData.append('journal', this.manuscript.journal);
    formData.append('articleTitle', this.manuscript.articleTitle);
    formData.append('articleCategory', this.manuscript.articleCategory);
    formData.append('abstract', this.manuscript.abstract);
    formData.append('keywords', this.manuscript.keywords);
    formData.append('correspondingAuthor', this.manuscript.correspondingAuthor);
    formData.append('authorEmail', this.manuscript.authorEmail);
    formData.append('institution', this.manuscript.institution);

    // Append the manuscript file. The '!' is a non-null assertion, safe because of validateForm().
    formData.append('manuscriptFile', this.manuscript.manuscriptFile!, this.manuscript.manuscriptFile!.name);

    // Stringify the reviewers array and append it as a JSON string
    formData.append('reviewers', JSON.stringify(this.manuscript.reviewers));

    // Append comments (this field is allowed to be blank)
    formData.append('comments', this.manuscript.comments);

    // Subscribe to the manuscript submission service
    debugger;
    this.manuscriptSubmissionService.submitManuscript(formData).subscribe({
      next: (response) => {
        // On successful submission, show a success toast notification
        this.userToastNotificationService.showToast('Success', `Manuscript submitted successfully.`, 'success');
        // Optionally, reset the form or navigate
        // this.resetForm();
      },
      error: (error) => {
        // On submission error, show an error toast notification
        // console.error('Error submitting manuscript:', error);
        // Attempt to get a more specific error message from the backend response
        const errorMessage = error.error?.message || error.message || 'Submission failed. Please try again.';
        this.userToastNotificationService.showToast('Submission Error', errorMessage, 'danger');
      }
    });
  }
}