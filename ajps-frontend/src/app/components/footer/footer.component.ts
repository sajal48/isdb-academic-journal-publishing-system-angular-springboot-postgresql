// footer.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JournalDetailsService } from '../../site-settings/services/journal-details.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  journals: any[] = [];
  isLoading: boolean = true;

  constructor(private journalService: JournalDetailsService) { }

  ngOnInit(): void {
    this.loadJournals();
  }

  loadJournals(): void {
    this.journalService.getAllJournals().subscribe({
      next: (data) => {
        this.journals = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching journals:', error);
        this.isLoading = false;
      }
    });
  }
}