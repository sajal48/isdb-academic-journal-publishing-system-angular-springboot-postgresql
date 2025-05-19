import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-submission',
  imports: [RouterOutlet, CommonModule, RouterModule],
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
    const completedSteps = ['manuscript-details', 'author-informations']; // example   , 'author-informations'
    return completedSteps.includes(step);
  }

}
