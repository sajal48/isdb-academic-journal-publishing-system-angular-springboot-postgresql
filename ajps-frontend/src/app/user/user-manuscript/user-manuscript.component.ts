import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-manuscript',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './user-manuscript.component.html',
  styleUrl: './user-manuscript.component.css'
})
export class UserManuscriptComponent {
  manuscript = {
    id: 'MS12345',
    title: 'Monitoring the Seasonal Distribution and Variation of Sea Surface Temperature and Chlorophyll Concentration in Bay of Bengal using MODIS Satellite Images',
    journalName: 'Journal of Modern Science',
    submissionDate: new Date('2025-05-01'),
  }

}
