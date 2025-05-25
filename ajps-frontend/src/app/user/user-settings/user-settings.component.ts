import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthLoginRegisterService } from '../../site-settings/auth/auth-login-register.service';
import { UserProfileSettingsService } from '../../site-settings/user-profile/user-profile-settings.service';
import { UserToastNotificationService } from '../../site-settings/user-profile/user-toast-notification.service';
import { FormsModule } from '@angular/forms';

declare const bootstrap: any;

@Component({
  selector: 'app-user-settings',
  imports: [FormsModule],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css'
})
export class UserSettingsComponent implements OnInit {
  userId: number = 0;
  userEmail: string = '';
  newEmail: string = '';
  otp!: number;
  currentPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';

  constructor(
    private authLoginRegisterService: AuthLoginRegisterService,
    private userProfileSettings: UserProfileSettingsService,
    private userToastNotificationService: UserToastNotificationService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.authLoginRegisterService.isAuthenticated().subscribe({
      next: (isValid) => {
        if (isValid) {
          this.userEmail = this.authLoginRegisterService.getUserEmail();
          this.userId = this.authLoginRegisterService.getUserID();
        }
      }
    });
  }

  onEmailSubmit(event: Event): void {
    event.preventDefault();

    if (!this.validateEmail(this.newEmail)) {
      // alert('Please enter a valid email.');
      this.userToastNotificationService.showToast('Error', `Please enter a valid email.`, 'danger');
      return;
    }

    this.userProfileSettings.requestEmailChange(this.userId, this.newEmail).subscribe({
      next: (response) => {
        if (response.code == 200) {
          const modal = new bootstrap.Modal(document.getElementById('emailOtpModal')!);
          modal.show();

        } else {
          this.userToastNotificationService.showToast('Error', `${response.message}`, 'danger');
        }
      },
      error: (error) => {
        // alert(error.error?.message || 'Failed to send OTP');
        this.userToastNotificationService.showToast('Error', 'Failed to send OTP.', 'danger');
      }
    });
  }

  onEmailOtpVerify(): void {
    // if (!/^\d{6}$/.test(this.otp)) {
    //   this.userToastNotificationService.showToast('Error', 'Invalid OTP format. Enter 6 digits.', 'danger');
    //   return;
    // }

    this.userProfileSettings.confirmEmailChange(this.userId, this.newEmail, this.otp).subscribe({
      next: (response) => {
        if (response.code == 200) {
          // const modal = new bootstrap.Modal(document.getElementById('emailOtpModal')!);
          // modal.hide();
          // alert('Email changed successfully!');
          // this.router.navigate(['/user/settings']);
          const modalElement = document.getElementById('emailOtpModal');
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
          }
          this.newEmail = "";
          this.userToastNotificationService.showToast('Success', 'Email changed successfully.', 'success');
          // this.userToastNotificationService.showToast('Info', 'You will be signed out in 2 seconds.', 'info');
          setTimeout(() => {
            this.userToastNotificationService.showToast('Info', 'You will be signed out in 2 seconds.', 'info');
          }, 500);
          // window.location.reload(); // Or update currentEmail from API
          setTimeout(() => {
            // window.location.reload();
            this.authLoginRegisterService.logout();
          }, 2000);

        } else {
          this.userToastNotificationService.showToast('Error', `${response.message || 'OTP verification failed.'}`, 'danger');
        }
      },
      error: (error) => {
        // alert(error.error?.message || 'OTP verification failed');
        this.userToastNotificationService.showToast('Error', `${error.error?.message || 'OTP verification failed.'}`, 'danger');
      }
    });

  }

  validateEmail(email: string): boolean {
    return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
  }

  
  onPasswordSubmit(): void {
    if (this.newPassword !== this.confirmNewPassword) {
      this.userToastNotificationService.showToast('Error', 'Passwords do not match.', 'danger');
      return;
    }

    if (this.newPassword.length < 6) {
      this.userToastNotificationService.showToast('Error', 'Password must be at least 6 characters.', 'danger');
      return;
    }

    const payload = {
      userId: this.userId,
      // currentPassword: this.currentPass,
      // newPassword: this.newPass,
      userEmail: this.userEmail
    };

    this.userProfileSettings.changePassword(payload).subscribe({
      next: (response) => {
        // this.userToastNotificationService.showToast('Success', 'Password changed successfully.', 'success');
        // this.currentPass = this.newPass = this.confirmNewPass = '';
        if (response.code == 200) {
          const modal = new bootstrap.Modal(document.getElementById('passwordOtpModal')!);
          modal.show();

        } else {
          this.userToastNotificationService.showToast('Error', `${response.message}`, 'danger');
        }
      },
      error: (error) => {
        this.userToastNotificationService.showToast('Error', error.error?.message || 'Password change failed.', 'danger');
      }
    });
  }

  onPasswordOtpVerify(): void {
    // if (!/^\d{6}$/.test(this.otp)) {
    //   this.userToastNotificationService.showToast('Error', 'Invalid OTP format. Enter 6 digits.', 'danger');
    //   return;
    // }

    this.userProfileSettings.confirmPasswordChange(this.userId, this.currentPassword, this.newPassword, this.otp).subscribe({
      next: (response) => {
        if (response.code === 200) {
          const modalElement = document.getElementById('passwordOtpModal');
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
          }
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmNewPassword = '';
          this.otp = 0;
          
          this.userToastNotificationService.showToast('Success', 'Password changed successfully.', 'success');
          setTimeout(() => {
            this.userToastNotificationService.showToast('Info', 'You will be signed out in 2 seconds.', 'info');
          }, 500);
          setTimeout(() => {
            // window.location.href = '/auth/login'; // or force logout
            // window.location.reload();
            this.authLoginRegisterService.logout();
          }, 2000);
        } else {
          this.userToastNotificationService.showToast('Error', `${response.message || 'OTP verification failed.'}`, 'danger');
        }
      },
      error: (error) => {
        this.userToastNotificationService.showToast('Error', `${error.error?.message || 'OTP verification failed.'}`, 'danger');
      }
    });
  }

    

}
