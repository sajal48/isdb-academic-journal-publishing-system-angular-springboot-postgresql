import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiConfig } from '../configs/api-config';

export interface Journal {
  id?: number;
  journalName: string;
  issn: string;
  frequency: string;
  journalType: string;
  journalCode: string;
  contactEmail: string;
  journalUrl: string;
  aimsScopes: string;
  aboutJournal: string;
  coverImageUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class JournalOperationsService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Journal[]> {
    return this.http.get<Journal[]>(`${apiConfig.apiBaseUrl}/journal/get-all-journals`);
  }

  create(formData: FormData): Observable<Journal> {
    return this.http.post<Journal>(`${apiConfig.apiBaseUrl}/journal/create-journal`, formData);
  }

  update(id: number, formData: FormData): Observable<Journal> {
    return this.http.put<Journal>(`${apiConfig.apiBaseUrl}/journal/update-journal/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${apiConfig.apiBaseUrl}/journal/delete-journal/${id}`);
  }
}
