import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../../site-settings/interface/user-profile-interface';
import { UserProfileDetailsService } from '../../site-settings/user-profile/user-profile-details.service';
import { FormsModule } from '@angular/forms';
import { AuthLoginRegisterService } from '../../site-settings/auth/auth-login-register.service';
import { UserToastNotificationService } from '../../site-settings/user-profile/user-toast-notification.service';

@Component({
  selector: 'app-user-profile-edit',
  imports: [FormsModule],
  templateUrl: './user-profile-edit.component.html',
  styleUrl: './user-profile-edit.component.css'
})
export class UserProfileEditComponent implements OnInit {
  userId = 0;

  constructor(
    private userProfileDetailsService: UserProfileDetailsService,
    private authLoginRegisterService: AuthLoginRegisterService,
    private userToastNotificationService: UserToastNotificationService

  ) {
    this.userId = this.authLoginRegisterService.getUserID();
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
    email: '',
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

}
