import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserSubmissionDetailsService } from '../../../site-settings/submission/user-submission-details.service';
import { AuthLoginRegisterService } from '../../../site-settings/auth/auth-login-register.service';
import { UserToastNotificationService } from '../../../site-settings/user-profile/user-toast-notification.service';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
}

@Component({
  selector: 'app-submission-step-three',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './submission-step-three.component.html',
  styleUrl: '../user-submission.component.css'
})
export class SubmissionStepThreeComponent implements OnInit {
userId: number = 0;
  submissionId: string | null = '';
  isLoading: boolean = false;
  fileError: string = '';
  selectedFile: File | null = null;
  uploadedFiles: UploadedFile[] = [];

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
    this.loadUploadedFiles();
  }

  loadUploadedFiles(): void {
    if (this.submissionId) {
      this.userSubmissionDetailsService.getManuscriptDetailsBySubmissionId(this.submissionId)
        .subscribe({
          next: (response) => {
            if (response.code === 200 && response.data.files) {
              this.uploadedFiles = response.data.files;
            }
          },
          error: (err) => {
            console.error('Error loading uploaded files:', err);
          }
        });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                           'application/zip'];
      if (!allowedTypes.includes(file.type)) {
        this.fileError = 'Invalid file type. Please upload DOC, DOCX, PDF, or ZIP files only.';
        return;
      }

      // Validate file size (e.g., 10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        this.fileError = 'File size exceeds 10MB limit.';
        return;
      }

      this.selectedFile = file;
      this.fileError = '';
    }
  }

  uploadFile(): void {
    if (!this.selectedFile || !this.submissionId) {
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('submissionId', this.submissionId);

    this.userSubmissionDetailsService.uploadManuscriptFile(formData)
      .subscribe({
        next: (response) => {
          if (response.code === 200) {
            this.uploadedFiles.push({
              name: this.selectedFile!.name,
              size: this.selectedFile!.size,
              type: this.selectedFile!.type
            });
            this.selectedFile = null;
            this.userToastNotificationService.showToast('Success', 'File uploaded successfully.', 'success');
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.userToastNotificationService.showToast('Error', 'Failed to upload file.', 'danger');
          this.isLoading = false;
        }
      });
  }

  removeFile(index: number): void {
    if (!this.submissionId) {
      return;
    }

    const fileToRemove = this.uploadedFiles[index];
    this.isLoading = true;

    this.userSubmissionDetailsService.removeManuscriptFile(this.submissionId, fileToRemove.name)
      .subscribe({
        next: (response) => {
          if (response.code === 200) {
            this.uploadedFiles.splice(index, 1);
            this.userToastNotificationService.showToast('Success', 'File removed successfully.', 'success');
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.userToastNotificationService.showToast('Error', 'Failed to remove file.', 'danger');
          this.isLoading = false;
        }
      });
  }

  onSubmit(form: NgForm): void {
    if (this.uploadedFiles.length === 0) {
      this.userToastNotificationService.showToast('Error', 'Please upload at least one manuscript file.', 'danger');
      return;
    }

    this.isLoading = true;
    const payload = {
      submissionId: this.submissionId,
      completedSteps: ['manuscript-upload'] // Mark this step as completed
    };

    this.userSubmissionDetailsService.updateSubmissionSteps(payload)
      .subscribe({
        next: (response) => {
          if (response.code === 200) {
            this.userToastNotificationService.showToast('Success', 'Manuscript uploaded successfully.', 'success');
            this.router.navigate(['/user/submission/suggested-reviewers']);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error(error);
          this.userToastNotificationService.showToast('Error', 'Failed to complete manuscript upload.', 'danger');
          this.isLoading = false;
        }
      });
  }

  exitToDashboard(): void {
    this.userSubmissionDetailsService.clearSubmissionId();
    this.router.navigate(['/user/dashboard']);
  }
}