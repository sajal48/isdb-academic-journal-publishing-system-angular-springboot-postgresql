import { Component, OnInit } from '@angular/core';
import { UserProfileDetailsService } from '../../site-settings/user-profile/user-profile-details.service';
import { UserProfile } from '../../site-settings/interfaces/user-profile-interface';
import { CommonModule } from '@angular/common';
import { AuthLoginRegisterService } from '../../site-settings/auth/auth-login-register.service';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: UserProfile | null = null;
  loading = true;
  profilePictureUrl: string | undefined;
  userEmail = '';

  constructor(
    private authLoginRegisterService: AuthLoginRegisterService,
    private userProfileDetailsService: UserProfileDetailsService

  ) {
    this.userEmail = this.authLoginRegisterService.getUserEmail();
  }

  ngOnInit(): void {
    
    this.userProfileDetailsService.profileDetails().subscribe({
      next: (response) => {
        this.user = response.data;
        this.loading = false;
        // console.log(this.user);
        this.profilePictureUrl = this.user?.profileImage;
      },
      error: (err) => {
        // console.error('Failed to load profile', err);
        this.loading = false;
      }
    });

  }

}
