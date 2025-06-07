import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { SubmissionList } from '../interfaces/submission-list-interface';
import { AuthLoginRegisterService } from '../auth/auth-login-register.service';
import { apiConfig } from '../configs/api-config';

@Injectable({
  providedIn: 'root'
})
export class UserSubmissionDetailsService {
  private storageKey = 'submissionId';

  constructor(
    private http: HttpClient,
    private authLoginRegisterService: AuthLoginRegisterService
  ) {}

  getSubmissionId(): number {
    const id = sessionStorage.getItem(this.storageKey);
    return id ? +id: 0;
  }
  
  setSubmissionId(id: number): void {
    sessionStorage.setItem(this.storageKey, id.toString());
  }
  
  clearSubmissionId(): void {
    sessionStorage.removeItem(this.storageKey);
  }

  getSubmissionList(): Observable<{status: string, code: number, data: SubmissionList[]}> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const userId = this.authLoginRegisterService.getUserID();
    return this.http.get<{status: string, code: number, data: SubmissionList[]}>(`${apiConfig.apiBaseUrl}/user/submission/submission-list/${userId}`, {headers});
  }

  getManuscriptDetailsBySubmissionId(submissionId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const userId = this.authLoginRegisterService.getUserID();
    return this.http.get(`${apiConfig.apiBaseUrl}/user/submission/submission-details/${userId}/${submissionId}`, { headers });
  }

  saveManuscriptDetails(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${apiConfig.apiBaseUrl}/user/submission/submit/manuscript-details`, payload, { headers });
  }

  saveAuthorInformations(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${apiConfig.apiBaseUrl}/user/submission/submit/author-informations`, payload, { headers });
  }

  removeAuthor(submissionId: number, authorId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(`${apiConfig.apiBaseUrl}/user/submission/remove-author/${submissionId}/${authorId}`, { headers });
  }

  updateSubmissionSteps(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${apiConfig.apiBaseUrl}/user/submission/update/completed-steps`, payload, { headers });
  }

  updateManuscriptDetails(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${apiConfig.apiBaseUrl}/user/submission/update/manuscript-details`, payload, { headers });
  }

  /*uploadManuscriptFile(submissionId: string, formData: FormData): Observable<any> {
    return this.http.post(`${apiConfig.apiBaseUrl}/user/submission/upload/manuscript`, formData);
  }*/

  /*removeManuscriptFile(submissionId: string, fileName: string): Observable<any> {
    return this.http.delete(`${apiConfig.apiBaseUrl}/user/submission/remove/manuscript/${submissionId}/${fileName}`);
  }*/

  uploadManuscriptFile(submissionId: number, file: File): Observable<any> {
    // const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const formData = new FormData();
    formData.append('file', file);
    formData.append('submissionId', submissionId.toString());
    debugger
    return this.http.post(`${apiConfig.apiBaseUrl}/user/submission/manuscript/upload`, formData);
  }

  removeManuscriptFile(submissionId: number, fileId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(`${apiConfig.apiBaseUrl}/user/submission/manuscript/remove/${submissionId}/${fileId}`, {headers});
  }

}