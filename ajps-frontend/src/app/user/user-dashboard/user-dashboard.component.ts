import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserSubmissionDetailsService } from '../../site-settings/submission/user-submission-details.service';
import { SubmissionList } from '../../site-settings/interfaces/submission-list-interface';

@Component({
  selector: 'app-user-dashboard',
  imports: [RouterLink, CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
  userId = 0;
  submissions: SubmissionList[] = [];

  constructor(
    private userSubmissionDetailsService: UserSubmissionDetailsService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.userSubmissionDetailsService.clearSubmissionId();

    this.userSubmissionDetailsService.getSubmissionList().subscribe({
      next: (response) => {
        this.submissions = response.data;
        // console.log(response);

      },
      error: (error) => {
        console.error('Error fetching submissions', error)
      }
    });
  }

  editManuscript(id: number) {
    this.userSubmissionDetailsService.setSubmissionId(id);
    this.router.navigate(['/user/submission']);
  }

  // Method to map submission status to color
  getSubmissionStatusColor(status: string): { 'background-color': string, color: string } {
    let bgColor = '#808080'; // Default gray for unknown or initial states
    let textColor = '#FFFFFF'; // Default white text for readability

    switch (status) {
      case 'SAVED':
        bgColor = '#808080'; // Gray
        textColor = '#FFFFFF';
        break;
      case 'SUBMITTED':
        bgColor = '#4682B4'; // Steel Blue
        textColor = '#FFFFFF';
        break;
      case 'UNDER_REVIEW':
        bgColor = '#FFD700'; // Gold
        textColor = '#333333'; // Darker text for readability on yellow
        break;
      case 'REVISION_REQUIRED':
        bgColor = '#FFA500'; // Orange
        textColor = '#FFFFFF';
        break;
      case 'ACCEPTED':
        bgColor = '#228B22'; // Forest Green
        textColor = '#FFFFFF';
        break;
      case 'DUE_PAYMENT':
        bgColor = '#DC143C'; // Crimson
        textColor = '#FFFFFF';
        break;
      case 'COPY_EDITING':
        bgColor = '#1E90FF'; // Dodger Blue
        textColor = '#FFFFFF';
        break;
      case 'PUBLICATION':
        bgColor = '#8A2BE2'; // Blue Violet
        textColor = '#FFFFFF';
        break;
      case 'PUBLISHED':
        bgColor = '#008000'; // Green
        textColor = '#FFFFFF';
        break;
      default:
        // Keep default gray if status is not recognized
        break;
    }
    return { 'background-color': bgColor, color: textColor };
  }

}
