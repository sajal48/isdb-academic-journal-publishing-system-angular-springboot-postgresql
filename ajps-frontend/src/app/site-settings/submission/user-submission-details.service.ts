import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { SubmissionList } from '../interfaces/submission-list-interface';
import { AuthLoginRegisterService } from '../auth/auth-login-register.service';
import { apiConfig } from '../configs/api-config';

@Injectable({
  providedIn: 'root'
})
export class UserSubmissionDetailsService {

  // private submissionId: number | null = null;
  private storageKey = 'submissionId';

  constructor(
    private http: HttpClient,
    private authLoginRegisterService: AuthLoginRegisterService
    
  ) {}

  getSubmissionId(): string | null {
    return sessionStorage.getItem(this.storageKey);
  }
  setSubmissionId(id: string): void {
    sessionStorage.setItem(this.storageKey, id);
  }
  clearSubmissionId(): void {
    sessionStorage.removeItem(this.storageKey);
  }

  getSubmissionList(): Observable<{status: string, code: number, data: SubmissionList[]}> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const userId = this.authLoginRegisterService.getUserID();
    return this.http.get<{status: string, code: number, data: SubmissionList[]}>(`${apiConfig.apiBaseUrl}/user/submission/submission-list/${userId}`, {headers});
  }

  saveManuscriptDetails(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${apiConfig.apiBaseUrl}/user/submission/submit/manuscript-details`, payload, { headers });
  }

  updateManuscriptDetails(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${apiConfig.apiBaseUrl}/user/submission/update/manuscript-details`, payload, { headers });
  }

  getManuscriptDetailsBySubmissionId(submissionId: string | null): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const userId = this.authLoginRegisterService.getUserID();
    return this.http.get(`${apiConfig.apiBaseUrl}/user/submission/submission-details/${userId}/${submissionId}`, { headers });
  }


}
