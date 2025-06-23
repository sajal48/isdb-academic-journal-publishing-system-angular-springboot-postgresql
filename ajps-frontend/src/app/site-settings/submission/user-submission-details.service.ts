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

  // handle submission id:
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

  // getting submissions:
  getSubmissionList(): Observable<{status: string, code: number, data: SubmissionList[]}> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const userId = this.authLoginRegisterService.getUserID();
    return this.http.get<{status: string, code: number, data: SubmissionList[]}>(`${apiConfig.apiBaseUrl}/user/submission/list/${userId}`, {headers});
  }
  getManuscriptDetailsBySubmissionId(submissionId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const userId = this.authLoginRegisterService.getUserID();
    return this.http.get(`${apiConfig.apiBaseUrl}/user/submission/details/${userId}/${submissionId}`, { headers });
  }

  // handling user manuscript submission:
  // update completed steps:
  updateSubmissionSteps(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${apiConfig.apiBaseUrl}/user/submission/steps/update`, payload, { headers });
  }

  // step-1: manuscript details:
  saveManuscriptDetails(payload: any): Observable<any> {
    debugger
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${apiConfig.apiBaseUrl}/user/submission/manuscript-details/save`, payload, { headers });
  }
  updateManuscriptDetails(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${apiConfig.apiBaseUrl}/user/submission/manuscript-details/update`, payload, { headers });
  }

  // step-2: author information:
  saveAuthorInformations(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${apiConfig.apiBaseUrl}/user/submission/author-informations/save`, payload, { headers });
  }
  removeAuthor(submissionId: number, authorId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(`${apiConfig.apiBaseUrl}/user/submission/author/remove/${submissionId}/${authorId}`, { headers });
  }

  // step-3: upload manuscript files:
  uploadManuscriptFile(submissionId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('submissionId', submissionId.toString());
    return this.http.post(`${apiConfig.apiBaseUrl}/user/submission/manuscript-files/upload`, formData);
  }
  removeManuscriptFile(submissionId: number, fileId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(`${apiConfig.apiBaseUrl}/user/submission/manuscript-files/remove/${submissionId}/${fileId}`, {headers});
  }

  // step-4: suggested reviewers:
  saveReviewerInformations(payload: {
    submissionId: number;
    reviewers: { name: string; email: string; institution: string }[];
  }): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${apiConfig.apiBaseUrl}/user/submission/reviewer-informations/save`, payload, { headers });
  }
  removeReviewer(submissionId: number, reviewerId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete(`${apiConfig.apiBaseUrl}/user/submission/reviewer/remove/${submissionId}/${reviewerId}`, { headers });
  }

  // step-5: additional information:
  saveAdditionalInformation(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(`${apiConfig.apiBaseUrl}/user/submission/additional-informations/save`, payload, { headers });
  }

  // step-6: confirm submission:
  submitManuscript(payload: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${apiConfig.apiBaseUrl}/user/submission/submit-manuscript/save`, payload, { headers });
  }






  deleteSubmission(submissionId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });    
    return this.http.delete(`${apiConfig.apiBaseUrl}/user/submission/delete/${submissionId}`, { headers });
}


}