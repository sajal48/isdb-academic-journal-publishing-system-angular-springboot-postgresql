import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { JournalDetailsService, Paper, Issue } from '../../site-settings/services/journal-details.service';

@Component({
  selector: 'app-journal-issue-articles',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './journal-issue-articles.component.html',
  styleUrls: ['./journal-issue-articles.component.css'],
  providers: [DatePipe]
})
export class JournalIssueArticlesComponent implements OnInit {
  issue: Issue | null = null;
  papers: Paper[] = [];
  isLoading = true;
  error: string | null = null;
  journalUrl: string = '';
  issueNumber: string = '';

  constructor(
    private journalService: JournalDetailsService,
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe(parentParams => {
      this.journalUrl = parentParams['journalUrl'];
      this.route.params.subscribe(params => {
        this.issueNumber = params['issueNumber'];
        this.loadIssue();
      });
    });
  }

  formatAuthors(authors: any[]): string {
    if (!authors || authors.length === 0) return '';
    
    return authors
      .map(author => author.name)
      .join(', ');
  }

  loadIssue(): void {
    this.isLoading = true;
    this.journalService.getIssuesByJournalUrl(this.journalUrl).subscribe({
      next: (issues) => {
        if (issues && issues.length > 0) {
          // Extract volume and number from the issueNumber (e.g., "vol1issue1")
          const match = this.issueNumber.match(/vol(\d+)issue(\d+)/i);
          if (match) {
            const volume = parseInt(match[1]);
            const number = parseInt(match[2]);
            
            // Find the issue with matching volume and number
            this.issue = issues.find(issue => 
              issue.volume === volume && issue.number === number
            ) || null;

            if (this.issue) {
              this.papers = this.issue.papers || [];
            } else {
              this.error = 'Issue not found';
            }
          } else {
            this.error = 'Invalid issue format';
          }
        } else {
          this.error = 'No issues found for this journal';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load issue';
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
      case 'editorial': return 'Editorial';
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
      this.issueNumber,
      'article',
      paper.id.toString()
    ];
  }

  getDownloadLink(paper: Paper): string {
    return paper.fileUpload?.fileUrl || '#';
  }
}