import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
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
}

@Injectable({
  providedIn: 'root'
})
export class JournalOperationsService {

  constructor(
    private http: HttpClient

  ) {}

  getAll(): Observable<Journal[]> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<Journal[]>(`${apiConfig.apiBaseUrl}/journal/get-all-journals`, {headers});
  }

  create(journal: Journal): Observable<Journal> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<Journal>(`${apiConfig.apiBaseUrl}/journal/create-journal`, journal, {headers});
  }

  update(id: number, journal: Journal): Observable<Journal> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put<Journal>(`${apiConfig.apiBaseUrl}/journal/update-journal/${id}`, journal, {headers});
  }

  delete(id: number): Observable<void> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.delete<void>(`${apiConfig.apiBaseUrl}/journal/delete-journal/${id}`, {headers});
  }

}
