import { Component, OnInit } from '@angular/core';
import { UserProfileDetailsService } from '../../site-settings/user-profile/user-profile-details.service';
import { UserProfile } from '../../site-settings/interface/user-profile-interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: UserProfile | null = null;
  loading = true;

  constructor(
    private userProfileDetailsService: UserProfileDetailsService
  ){}

  ngOnInit(): void {
    
    this.userProfileDetailsService.profileDetails().subscribe({
      next: (response) => {
        this.user = response.data;
        this.loading = false;
        // console.log(this.user);
      },
      error: (err) => {
        // console.error('Failed to load profile', err);
        this.loading = false;
      }
    });

  }

}
