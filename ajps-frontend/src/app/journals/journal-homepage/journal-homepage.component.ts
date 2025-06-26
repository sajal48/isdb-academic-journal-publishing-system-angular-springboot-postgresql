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
    this.route.parent?.paramMap.subscribe(params => {
    const journalUrl = params.get('journalUrl');
    if (journalUrl) {
      this.loadJournalDetails(journalUrl);
    } else {
      this.error = 'Journal url is missing from URL';
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