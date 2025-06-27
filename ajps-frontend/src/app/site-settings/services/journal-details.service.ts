// journal.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

// paper.model.ts
export interface Author {
  id: number;
  name: string;
  email: string;
  institution: string;
  corresponding: boolean;
}

export interface Paper {
  id: number;
  submission: {
    id: number;
    submissionNumber: number;
    manuscriptTitle: string;
    manuscriptCategory: string;
    abstractContent: string;
    manuscriptKeywords: string;
    submissionStatus: string;
    createdAt: string;
    submittedAt: string;
    authors: Author[];
  };
  fileUpload: {
    fileUrl: string;
  };
}

// issue.model.ts
export interface Issue {
  id: number;
  volume: number;
  number: number;
  publicationDate: string;
  status: string;
  papers: Paper[];
}

export interface AdminJournalDto {
  id: number;
  journalName: string;
  issn: string;
  frequency: string;
  journalType: string;
  journalCode: string;
  contactEmail: string;
  journalUrl: string;
  aimsScopes: string;
  aboutJournal: string;
  coverImageUrl: string;
  issues: Issue[];
}

@Injectable({
  providedIn: 'root'
})
export class JournalDetailsService {
  private apiUrl = 'http://localhost:8090/api/journal';

  constructor(private http: HttpClient) { }

  getAllJournals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-all-journals`);
  }

  // journal.service.ts
  getJournalByJournalUrl(journalCode: string): Observable<AdminJournalDto> {
    if (!journalCode) {
      throw new Error('Journal code is required');
    }
    return this.http.get<AdminJournalDto>(`${this.apiUrl}/get-journal/${journalCode}`);
  }

  getIssuesByJournalUrl(journalUrl: string): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.apiUrl}/get-journal/${journalUrl}/issues`);
  }

}