import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { JournalDetailsService, Paper, Issue, Author } from '../../site-settings/services/journal-details.service';
import { Title } from '@angular/platform-browser';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-journal-article-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journal-article-page.component.html',
  styleUrls: ['./journal-article-page.component.css'],
  providers: [DatePipe]
})
export class JournalArticlePageComponent implements OnInit {
  article: Paper | null = null;
  issueDetails: { volume: number, number: number, publicationDate: string } | null = null;
  isLoading = true;
  error: string | null = null;
  currentUrl: string = '';
  journalName: string = 'Journal Name'; // Initialize with default

  constructor(
    private journalService: JournalDetailsService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.currentUrl = window.location.href;
    this.loadArticleData();
  }

  private loadArticleData(): void {
    const articleId = Number(this.route.snapshot.params['id']);
    const issueNumber = this.route.snapshot.params['issueNumber'];
    const journalUrl = this.route.snapshot.parent?.params['journalUrl'];

    if (!journalUrl || !issueNumber || isNaN(articleId)) {
      this.handleError('Invalid URL parameters');
      return;
    }

    // First get journal details to get the journal name
    this.journalService.getJournalByJournalUrl(journalUrl).pipe(
      catchError(err => {
        console.error('Journal fetch error:', err);
        // Continue even if journal name fails
        return of(null);
      })
    ).subscribe(journal => {
      if (journal) {
        this.journalName = journal.journalName;
      }
      this.loadIssueData(journalUrl, issueNumber, articleId);
    });
  }

  private loadIssueData(journalUrl: string, issueNumber: string, articleId: number): void {
    const parsedIssue = this.parseIssueNumber(issueNumber);
    if (!parsedIssue) {
      this.handleError('Invalid issue number format (should be volXissueY)');
      return;
    }

    this.journalService.getIssuesByJournalUrl(journalUrl).pipe(
      catchError(err => {
        console.error('API Error:', err);
        this.handleError('Failed to fetch journal data');
        return of([] as Issue[]);
      })
    ).subscribe({
      next: (issues) => this.processIssueData(issues, parsedIssue, articleId)
    });
  }

  private parseIssueNumber(issueNumber: string): { volume: number, number: number } | null {
    const match = issueNumber.match(/vol(\d+)issue(\d+)/i);
    if (!match) return null;

    const volume = parseInt(match[1]);
    const number = parseInt(match[2]);

    return isNaN(volume) || isNaN(number) ? null : { volume, number };
  }

  private processIssueData(issues: Issue[], parsedIssue: { volume: number, number: number }, articleId: number): void {
    try {
      const foundIssue = issues.find(issue => 
        issue.volume === parsedIssue.volume && 
        issue.number === parsedIssue.number &&
        issue.status === 'PUBLISHED'
      );

      if (!foundIssue) {
        throw new Error(`Issue vol${parsedIssue.volume}issue${parsedIssue.number} not found or not published`);
      }

      this.issueDetails = {
        volume: foundIssue.volume,
        number: foundIssue.number,
        publicationDate: foundIssue.publicationDate
      };

      const foundArticle = foundIssue.papers.find(paper => paper.id === articleId);
      if (!foundArticle) {
        throw new Error(`Article with ID ${articleId} not found in this issue`);
      }

      this.article = foundArticle;
      this.titleService.setTitle(`${foundArticle.submission.manuscriptTitle} - ${this.journalName}`);
    } catch (err) {
      this.handleError(err instanceof Error ? err.message : 'Failed to process article data');
    } finally {
      this.isLoading = false;
    }
  }

  private handleError(message: string): void {
    this.error = message;
    this.isLoading = false;
    console.error('Article Page Error:', message);
  }

  formatAuthors(authors: Author[]): { names: string, details: string } {
    if (!authors || authors.length === 0) {
      return { names: '', details: '' };
    }

    const names = authors.map((author, index) => 
      `${author.name}${author.corresponding ? '*' : ''}<sup>${index + 1}</sup>`
    ).join(', ');

    const details = authors.map((author, index) => 
      // `<sup>${index + 1}</sup>${author.institution}${author.corresponding ? ' (corresponding author)' : ''}`
      `<sup>${index + 1}</sup>${author.institution}`
    ).join(', ');

    return { names, details };
  }

  getCorrespondingAuthor(authors: Author[]): Author | null {
    return authors?.find(a => a.corresponding) || authors?.[0] || null;
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'longDate') || '';
  }

  getArticleType(category: string): string {
    const types: Record<string, string> = {
      research: 'Research Article',
      review: 'Review Article',
      short: 'Short Communication',
      editorial: 'Editorial'
    };
    return types[category] || 'Article';
  }

  getShareLinks(): { facebook: string; twitter: string; linkedin: string } {
    const title = this.article?.submission.manuscriptTitle || '';
    return {
      facebook: `https://www.facebook.com/sharer.php?u=${encodeURIComponent(this.currentUrl)}`,
      twitter: `https://twitter.com/share?text=${encodeURIComponent(title)}&url=${encodeURIComponent(this.currentUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(this.currentUrl)}`
    };
  }

  getCitation(): string {
    if (!this.article || !this.article.submission.authors?.length || !this.issueDetails) return '';

    const firstAuthor = this.article.submission.authors[0].name.split(' ').pop();
    const year = new Date(this.article.submission.submittedAt).getFullYear();
    
    return `${firstAuthor} et al. (${year}). ${this.article.submission.manuscriptTitle}. 
            <em>${this.journalName}</em>, ${this.issueDetails.volume}(${this.issueDetails.number})`
  }
}