import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserSubmissionDetailsService } from '../../../site-settings/submission/user-submission-details.service';
import { UserToastNotificationService } from '../../../site-settings/user-profile/user-toast-notification.service';
import { CommonModule } from '@angular/common';

interface UploadedFile {
  id: number;
  storedName: string;
  originalName: string;
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

  submissionId: number = 0;
  isLoading: boolean = false;
  fileError: string = '';
  selectedFile: File | null = null;
  uploadedFiles: UploadedFile[] = [];

  constructor(
    private userSubmissionDetailsService: UserSubmissionDetailsService,
    private userToastNotificationService: UserToastNotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.submissionId = this.userSubmissionDetailsService.getSubmissionId();
    this.loadUploadedFiles();
  }

  loadUploadedFiles(): void {
    if (this.submissionId) {
      this.isLoading = true;
      this.userSubmissionDetailsService.getManuscriptDetailsBySubmissionId(this.submissionId)
        .subscribe({
          next: (response) => {
            if (response.code === 200 && response.data.files) {
              this.uploadedFiles = response.data.files.map((file: any) => ({
                id: file.id,
                storedName: file.storedName,
                originalName: file.originalName,
                size: file.size,
                type: file.type
              }));
            }
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Error loading uploaded files:', err);
            this.isLoading = false;
          }
        });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        this.fileError = 'Invalid file type. Please upload DOC, DOCX, PDF, or ZIP files only.';
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
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
    this.userSubmissionDetailsService.uploadManuscriptFile(this.submissionId, this.selectedFile)
      .subscribe({
        next: (response) => {
          if (response.code === 200) {
            this.uploadedFiles.push({
              id: response.data.id,
              storedName: response.data.fileName,
              originalName: response.data.originalName,
              size: response.data.size,
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

  removeFile(fileId: number): void {
    if (!this.submissionId) {
      return;
    }

    this.isLoading = true;
    this.userSubmissionDetailsService.removeManuscriptFile(this.submissionId, fileId)
      .subscribe({
        next: (response) => {
          if (response.code === 200) {
            this.uploadedFiles = this.uploadedFiles.filter(file => file.id !== fileId);
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
      completedSteps: ['manuscript-upload']
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

  saveAndExit(): void {
    if (this.uploadedFiles.length > 0) {
      const payload = {
        submissionId: this.submissionId,
        completedSteps: ['manuscript-upload']
      };

      this.userSubmissionDetailsService.updateSubmissionSteps(payload)
        .subscribe({
          next: () => {
            this.userSubmissionDetailsService.clearSubmissionId();
            this.router.navigate(['/user/dashboard']);
          },
          error: (error) => {
            console.error(error);
            this.userToastNotificationService.showToast('Error', 'Failed to save progress.', 'danger');
          }
        });
    } else {
      this.userSubmissionDetailsService.clearSubmissionId();
      this.router.navigate(['/user/dashboard']);
    }
  }
}