import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthLoginRegisterService } from '../auth/auth-login-register.service';
import { Observable } from 'rxjs/internal/Observable';
import { apiConfig } from '../configs/api-config';

@Injectable({
  providedIn: 'root'
})
export class UserProfileSettingsService {
  
  private user_id: number;

  constructor(
    private http: HttpClient,
    private authLoginRegisterService: AuthLoginRegisterService

  ) {
    this.user_id = this.authLoginRegisterService.getUserID();
   }

  requestEmailChange(userId: number, newEmail: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { userId, newEmail };
    return this.http.post<any>(`${apiConfig.apiBaseUrl}/user/profile/change-email`, body, { headers });
  }

  confirmEmailChange(userId: number, newEmail: string, otp: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { userId, newEmail, otp };
    return this.http.post<any>(`${apiConfig.apiBaseUrl}/user/profile/verify-email-otp`, body, { headers });
  }

}
