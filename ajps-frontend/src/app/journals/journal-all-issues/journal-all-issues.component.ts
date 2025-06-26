import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminJournalDto, Issue, JournalDetailsService } from '../../site-settings/services/journal-details.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-journal-all-issues',
  templateUrl: './journal-all-issues.component.html',
  styleUrls: ['./journal-all-issues.component.css'],
  imports: [CommonModule, RouterLink]
})
export class JournalAllIssuesComponent implements OnInit {
  journal: AdminJournalDto | null = null;
  issues: Issue[] = [];

  constructor(
    private route: ActivatedRoute,
    private journalService: JournalDetailsService
  ) {}

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      const journalUrl = params.get('journalUrl');
      if (journalUrl) {
        this.journalService.getJournalByJournalUrl(journalUrl).subscribe({
          next: (data) => {
            this.journal = data;
            this.issues = data.issues
              .filter(issue => issue.status === 'PUBLISHED') // 🔥 Only keep published issues
              .sort((a, b) => {
                // Sort by volume DESC, then issue number DESC
                return b.volume !== a.volume
                  ? b.volume - a.volume
                  : b.number - a.number;
              });
          },
          error: (err) => console.error('Failed to load journal:', err)
        });
      }
    });
  }
}
