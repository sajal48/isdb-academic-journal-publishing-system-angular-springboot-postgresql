import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { apiConfig } from '../configs/api-config';

export interface Editor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  assignedJournals: { journalId: number; designation: string }[];
  status: string;
}

export interface Journal {
  id: number;
  journalName: string;
}

@Injectable({
  providedIn: 'root'
})
export class EditorialManagementService {

  constructor(
    private http: HttpClient

  ) {}

  getJournals(): Observable<Journal[]> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<Journal[]>(`${apiConfig.apiBaseUrl}/editorial/journals`);
  }

  getEditors(): Observable<Editor[]> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<Editor[]>(`${apiConfig.apiBaseUrl}/editorial/editors`);
  }

  assignEditor(editorId: number, journalId: number, designation: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(`${apiConfig.apiBaseUrl}/editorial/editors/assign`, {
      editorId,
      journalId,
      designation,
    });
  }

  removeEditor(editorId: number, journalId: number): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams()
      .set('editorId', editorId)
      .set('journalId', journalId);

    return this.http.delete(`${apiConfig.apiBaseUrl}/editorial/editors/unassign`, { params });
  }
  
}
