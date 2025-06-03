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
    this.userSubmissionDetailsService.setSubmissionId(id.toString());
    this.router.navigate(['/user/submission']);
  }

}
