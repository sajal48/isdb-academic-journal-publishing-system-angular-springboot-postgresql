import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { OnlineSubmissionFullpageComponent } from "./online-submission-fullpage/online-submission-fullpage.component";

@Component({
  selector: 'app-user-submission',
  imports: [CommonModule, RouterModule], //OnlineSubmissionFullpageComponent
  templateUrl: './user-submission.component.html',
  styleUrl: './user-submission.component.css'
})
export class UserSubmissionComponent implements OnInit {
  currentRoute: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.currentRoute = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  isStepCompleted(step: string): boolean {
    // Define your logic for step completion
    const completedSteps = ['']; // example: 'manuscript-details', 'author-informations', 'suggested-reviewers'
    return completedSteps.includes(step);
  }

}
