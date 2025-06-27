import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiConfig } from '../configs/api-config';
import { IssueRequest } from '../../user/admin-journal-publication/admin-journal-publication.component';

export interface Journal {
  id: number;
  journalName: string;
}

export interface Issue {
  id: number;
  volume: number;
  number: number;
  publicationDate: string;
  status: 'PUBLISHED' | 'FUTURE';
  papers: Paper[];
}

export interface Paper {
  id: number;
  title: string;
  authors: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class JournalPublicationOperationsService {

  constructor(private http: HttpClient) {}

  getJournals(): Observable<Journal[]> {
    return this.http.get<Journal[]>(`${apiConfig.apiBaseUrl}/journal/get-all-journals`);
  }

  getIssues(journalId: number): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${apiConfig.apiBaseUrl}/journals/${journalId}/issues`);
  }

  deleteIssue(issueId: number): Observable<void> {
    return this.http.delete<void>(`${apiConfig.apiBaseUrl}/issues/${issueId}`);
  }

  deletePaper(issueId: number, paperId: number): Observable<void> {
    return this.http.delete<void>(`${apiConfig.apiBaseUrl}/issues/${issueId}/papers/${paperId}`);
  }

  addIssue(journalId: number, issue: Partial<Issue>): Observable<Issue> {
    return this.http.post<Issue>(`${apiConfig.apiBaseUrl}/journals/${journalId}/issues`, issue);
  }

  updateIssue(issue: IssueRequest): Observable<Issue> {
    return this.http.put<Issue>(`${apiConfig.apiBaseUrl}/issues/${issue.id}`, issue);
  }

  addPaper(issueId: number, paper: Partial<Paper>): Observable<Issue> {
    return this.http.post<Issue>(`${apiConfig.apiBaseUrl}/issues/${issueId}/papers`, paper);
  }

  updatePaper(issueId: number, paper: Paper): Observable<Paper> {
    return this.http.put<Paper>(`${apiConfig.apiBaseUrl}/issues/${issueId}/papers/${paper.id}`, paper);
  }
}
