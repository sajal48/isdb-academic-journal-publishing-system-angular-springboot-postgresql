import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { apiConfig } from '../configs/api-config';

export interface Editor {
  profileId: number;
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
    return this.http.get<Journal[]>(`${apiConfig.apiBaseUrl}/editorial/journals`, {headers});
  }

  getEditors(): Observable<Editor[]> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<Editor[]>(`${apiConfig.apiBaseUrl}/editorial/editors`);
  }

  assignEditor(profileId: number, journalId: number, designation: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(`${apiConfig.apiBaseUrl}/editorial/editors/assign`, {
      profileId,
      journalId,
      designation,
    }, {headers});
  }

  removeEditor(profileId: number, journalId: number): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const params = new HttpParams()
      .set('profileId', profileId)
      .set('journalId', journalId);

    return this.http.delete(`${apiConfig.apiBaseUrl}/editorial/editors/unassign`, { params },);
  }
  
}
