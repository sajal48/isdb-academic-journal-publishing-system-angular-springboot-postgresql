import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthLoginRegisterService } from '../auth/auth-login-register.service';
import { Observable } from 'rxjs/internal/Observable';
import { apiConfig } from '../configs/api-config';
import { ManuscriptSubmission } from '../interface/submission-manuscript-submission-model'; // Import the updated interface

@Injectable({
  providedIn: 'root'
})
export class ManuscriptSubmissionService {

  private user_id: number;

  constructor(
    private http: HttpClient,
    private authLoginRegisterService: AuthLoginRegisterService
  ) {
    this.user_id = this.authLoginRegisterService.getUserID();
  }

  /**
   * Submits manuscript data to the backend.
   * This method now sends the entire ManuscriptSubmission object as a JSON payload,
   * with the manuscriptFile field containing the Base64 encoded file content.
   * Angular's HttpClient automatically sets the 'Content-Type' to 'application/json'
   * when a JavaScript object is passed as the body.
   *
   * @param manuscriptData The ManuscriptSubmission object containing all form data,
   * including the Base64 encoded manuscript file.
   * @returns An Observable for the HTTP POST request.
   */
  submitManuscript(manuscriptData: ManuscriptSubmission): Observable<any> {
    // No need to explicitly set 'Content-Type': 'application/json' headers
    // when sending a JSON object, as HttpClient handles it automatically.
    // If you need other headers (e.g., Authorization), you would add them here.
    const headers = new HttpHeaders(); // Initialize headers if you need to add other non-content-type headers
    // Example: headers = headers.set('Authorization', 'Bearer ' + this.authLoginRegisterService.getToken());

    // The manuscriptData object will be automatically stringified to JSON by HttpClient
    // and sent with Content-Type: application/json.
    return this.http.post<any>(`${apiConfig.apiBaseUrl}/submission/submit`, manuscriptData, { headers });
  }

}
