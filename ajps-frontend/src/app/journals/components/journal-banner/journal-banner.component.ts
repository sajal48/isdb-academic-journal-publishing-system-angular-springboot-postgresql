import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminJournalDto, JournalDetailsService } from '../../../site-settings/services/journal-details.service';

@Component({
  selector: 'app-journal-banner',
  templateUrl: './journal-banner.component.html',
  styleUrls: ['./journal-banner.component.css'],
  imports: [CommonModule]
})
export class JournalBannerComponent implements OnInit {
  journal: AdminJournalDto | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private journalService: JournalDetailsService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const journalUrl = params.get('journalUrl');
      if (journalUrl) {
        this.journalService.getJournalByJournalUrl(journalUrl).subscribe({
          next: (data) => {
            this.journal = data;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Failed to load journal:', err);
            this.isLoading = false;
          }
        });
      }
    });
  }
}