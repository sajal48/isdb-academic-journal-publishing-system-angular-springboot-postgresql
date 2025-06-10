import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserSubmissionDetailsService } from '../../../site-settings/submission/user-submission-details.service';
import { UserToastNotificationService } from '../../../site-settings/user-profile/user-toast-notification.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface UploadedFile {
  id: number;
  storedName: string;
  originalName: string;
  size: number;
  type: string;
  fileUrl: string;
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
    private router: Router,
    private http: HttpClient
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
                type: file.type,
                fileUrl: file.fileUrl
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
        'application/zip',
        'application/x-zip-compressed'
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
              type: this.selectedFile!.type,
              fileUrl: response.data.fileUrl
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
            // this.router.navigate(['/user/submission/suggested-reviewers']);
            setInterval(() => {
            window.location.href="/user/submission/suggested-reviewers";
          }, 500);
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

  formatFileSize(bytes: number): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  downloadFile(fileUrl: string, originalFileName: string): void {
    this.isLoading = true;

    const downloadUrl = fileUrl;

    this.http.get(downloadUrl, { responseType: 'blob' })
      .subscribe({
        next: (response: Blob) => {
          // Create a blob URL and trigger the download
          const blob = new Blob([response], { type: response.type });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = originalFileName; // Use the original file name
          document.body.appendChild(a); // Append to body (required for Firefox)
          a.click(); // Programmatically click the link to trigger download
          window.URL.revokeObjectURL(url); // Clean up the URL object

          this.isLoading = false; // Re-enable buttons
        },
        error: (error: any) => {
          // console.error('Error downloading file:', error);
          // alert('Failed to download file. Please try again.');
          this.userToastNotificationService.showToast('Error', 'Failed to download file. Please try again.', 'danger');
          this.isLoading = false; // Re-enable buttons even on error
        }
      });
  }

  exitToDashboard(): void {
    this.userSubmissionDetailsService.clearSubmissionId();
    this.router.navigate(['/user/dashboard']);
  }
}