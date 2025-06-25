import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminJournalDto, JournalDetailsService } from '../../site-settings/services/journal-details.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-journal-homepage',
  templateUrl: './journal-homepage.component.html',
  styleUrls: ['./journal-homepage.component.css'],
  imports: [CommonModule]
})
export class JournalHomepageComponent implements OnInit {
  journal: AdminJournalDto | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private journalService: JournalDetailsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const journalCode = params.get('journalCode');
      if (journalCode) {
        this.loadJournalDetails(journalCode);
      } else {
        this.error = 'Journal code is missing from URL';
        this.isLoading = false;
      }
    });
  }

  loadJournalDetails(journalCode: string): void {
    this.journalService.getJournalByCode(journalCode).subscribe({
      next: (data) => {
        this.journal = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load journal details';
        this.isLoading = false;
      }
    });
  }
}