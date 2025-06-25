// journal.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

export interface Issue {
  id: number;
  number: number;
  volume: number;
  status: string;
  publicationDate: string; // or Date if you'll parse it
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
  getJournalByCode(journalCode: string): Observable<AdminJournalDto> {
    if (!journalCode) {
      throw new Error('Journal code is required');
    }
    return this.http.get<AdminJournalDto>(`${this.apiUrl}/get-journal/${journalCode}`);
  }

}