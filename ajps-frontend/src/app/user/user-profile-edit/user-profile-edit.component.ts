import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../../site-settings/interfaces/user-profile-interface';
import { UserProfileDetailsService } from '../../site-settings/user-profile/user-profile-details.service';
import { FormsModule } from '@angular/forms';
import { AuthLoginRegisterService } from '../../site-settings/auth/auth-login-register.service';
import { UserToastNotificationService } from '../../site-settings/toast-popup/user-toast-notification.service';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-profile-edit',
  imports: [FormsModule, RouterLink],
  templateUrl: './user-profile-edit.component.html',
  styleUrl: './user-profile-edit.component.css'
})
export class UserProfileEditComponent implements OnInit {
  userId = 0;
  userEmail = '';
  selectedFile: File | null = null;
  profilePictureUrl: string | undefined;

  constructor(
    private userProfileDetailsService: UserProfileDetailsService,
    private authLoginRegisterService: AuthLoginRegisterService,
    private userToastNotificationService: UserToastNotificationService,
    private sanitizer: DomSanitizer

  ) {
    this.userId = this.authLoginRegisterService.getUserID();
    this.userEmail = this.authLoginRegisterService.getUserEmail();
  }
  
  user: UserProfile = {
    userId: this.userId,
    nameTitle: '',
    firstName: '',
    middleName: '',
    lastName: '',
    professionalTitle: '',
    educationalQualification: '',
    institute: '',
    expertise: '',
    // email: '',
    mobile: '',
    telephone: '',
    country: '',
    address: '',
    zipCode: '',
    facebookUrl: '',
    twitterUrl: ''
  };

  ngOnInit(): void {
    
    this.userProfileDetailsService.profileDetails().subscribe({
      next: (response) => {
        this.user = response.data;
        this.user.userId = this.userId;
        // console.log(this.user);
        this.profilePictureUrl = this.user.profileImage;
      },
      error: (err) => {
        // console.error('Failed to load profile', err);
      }
    });

  }

  onSubmit() {
    this.userProfileDetailsService.profileUpdate(this.user).subscribe({
      next: (response) => {   

        if (response.code === 200 || response.code === 201) {
          // console.log(response.message);
          this.userToastNotificationService.showToast('Success', `${response.message}`, 'success');
          this.ngOnInit();

        } else {
          // console.log(response.message);
          this.userToastNotificationService.showToast('Error', `${response.message}`, 'danger');
          this.ngOnInit();
        }

      }
    });
  }

  onFileSelected(event: any) {
    // const file = event.target.files[0];
    // const maxSizeInMB = 5;
    // if (file && file.size > maxSizeInMB * 1024 * 1024) {
    //   // alert('File too large. Max allowed size is 5MB.');
    //   this.userToastNotificationService.showToast('Error', 'File too large. Max allowed size is 5MB.', 'danger');
    //   return;
    // }
    // this.selectedFile = file;

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
      if (!validTypes.includes(file.type)) {
        // alert('Unsupported file type. Please upload JPG, PNG, GIF, or BMP image.');
        this.userToastNotificationService.showToast('Error', 'Unsupported file type. Please upload JPG, PNG, GIF, or BMP image.', 'danger');
        input.value = '';
        return;
      }
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePictureUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }

  }

  onPictureSubmit() {
    if (!this.selectedFile) {
      this.userToastNotificationService.showToast('Error', 'Please select an image.', 'danger');
      return;
    }

    this.userProfileDetailsService.profilePictureUpdate(this.userId, this.selectedFile).subscribe({
      next: (response) => {
        this.userToastNotificationService.showToast('Success', response.message, 'success');
        this.ngOnInit();
      },
      error: (error) => {
        this.userToastNotificationService.showToast('Error', 'Failed to upload profile image.', 'danger');
      }
    });
  }


}
