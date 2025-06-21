import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { apiConfig } from '../configs/api-config';

interface JournalShort {
  id: number;
  title: string;
}

interface Reviewer {
  reviewerId: number;
  profileId: number;
  firstName: string;
  lastName: string;
  email: string;
  assignedJournals: JournalShort[];
}

@Injectable({
  providedIn: 'root'
})
export class ReviewerOperationsService {

  constructor(
    private http: HttpClient

  ) {}

  getAllReviewers(): Observable<Reviewer[]> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<Reviewer[]>(`${apiConfig.apiBaseUrl}/reviewers/get-all-reviewers`, {headers});
  }

  assignJournalsToReviewer(profileId: number, journalIds: number[]): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put(`${apiConfig.apiBaseUrl}/reviewers/${profileId}/assign-journals`, journalIds, { headers });
  }

  
}
