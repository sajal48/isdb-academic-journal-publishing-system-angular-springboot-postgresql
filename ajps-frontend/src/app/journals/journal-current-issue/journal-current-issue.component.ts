// journal-current-issue.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { Author, JournalDetailsService, Paper } from '../../site-settings/services/journal-details.service';

@Component({
  selector: 'app-journal-current-issue',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './journal-current-issue.component.html',
  styleUrls: ['./journal-current-issue.component.css'],
  providers: [DatePipe]
})
export class JournalCurrentIssueComponent implements OnInit {
  currentIssue: any;
  papers: Paper[] = [];
  isLoading = true;
  error: string | null = null;
  journalUrl: string = '';

  constructor(
    private journalService: JournalDetailsService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe(params => {
      this.journalUrl = params['journalUrl'];
      this.loadCurrentIssue();
    });
  }

  formatAuthors(authors: Author[]): string {
    if (!authors || authors.length === 0) return '';
    
    return authors
      .map(author => {
        let formatted = author.name;
        // if (author.institution) {
        //   formatted += ` (${author.institution})`;
        // }
        return formatted;
      })
      .join(', ');
  }

  loadCurrentIssue(): void {
    this.isLoading = true;
    this.journalService.getIssuesByJournalUrl(this.journalUrl).subscribe({
      next: (issues) => {
        if (issues && issues.length > 0) {
          // Find the most recent published issue
          this.currentIssue = issues
            .filter(issue => issue.status === 'PUBLISHED')
            .sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime())[0];
          
          if (this.currentIssue) {
            this.papers = this.currentIssue.papers || [];
          } else {
            this.error = 'No published issues found';
          }
        } else {
          this.error = 'No issues found for this journal';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load current issue';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'longDate') || '';
  }

  getCategoryDisplayName(category: string): string {
    switch(category) {
      case 'research': return 'Research Articles';
      case 'review': return 'Review Articles';
      case 'short': return 'Short Communications';
      default: return 'Articles';
    }
  }

  groupPapersByCategory(): { [key: string]: Paper[] } {
    return this.papers.reduce((groups, paper) => {
      const category = paper.submission.manuscriptCategory || 'other';
      const displayName = this.getCategoryDisplayName(category);
      
      if (!groups[displayName]) {
        groups[displayName] = [];
      }
      groups[displayName].push(paper);
      return groups;
    }, {} as { [key: string]: Paper[] });
  }

  getRouterLink(paper: Paper): string[] {
    return [
      '/journal', 
      this.journalUrl,
      `vol${this.currentIssue.volume}issue${this.currentIssue.number}`,
      'article',
      paper.id.toString()
    ];
  }

  getDownloadLink(paper: Paper): string {
    return paper.fileUpload?.fileUrl || '#';
  }
}