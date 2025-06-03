import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule} from '@angular/router';
import { UserSubmissionDetailsService } from '../../site-settings/submission/user-submission-details.service';

@Component({
  selector: 'app-user-submission',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-submission.component.html',
  styleUrl: './user-submission.component.css'
})
export class UserSubmissionComponent implements OnInit {
  currentRoute: string = '';
  submissionDetails: any[] = [];
  submissionId: string | null = '';
  completedSteps: string[] = [];

  constructor(
    private router: Router,
    private userSubmissionDetailsService: UserSubmissionDetailsService

  ) {}

  ngOnInit() {
    this.currentRoute = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });

    this.submissionId = this.userSubmissionDetailsService.getSubmissionId();

    if (this.submissionId) {
      this.userSubmissionDetailsService.getManuscriptDetailsBySubmissionId(this.submissionId)
        .subscribe({next: (response: any) => {
            this.submissionDetails = response.data;

            const stepsStr: string = response.data?.completedSteps || '';
            const newSteps = stepsStr
              .split(',')
              .map(step => step.trim())
              .filter(step => step !== '');

            // Append new steps to existing completedSteps array
            this.completedSteps.push(...newSteps);
            debugger
          },
          error: (err) => {
            console.error('Error loading submission details:', err);
          }
        });
    }


    // const completedStepsData: string = this.submissionDetails.map(detail => detail.completedSteps);
    // this.completedSteps.push(completedStepsData);
    // this.completedSteps = ["manuscript-details"];
  }

  isStepCompleted(step: string): boolean {
    //const completedSteps = ['']; // example: 'manuscript-details', 'author-informations', 'suggested-reviewers'
    return this.completedSteps.includes(step);
  }

}
