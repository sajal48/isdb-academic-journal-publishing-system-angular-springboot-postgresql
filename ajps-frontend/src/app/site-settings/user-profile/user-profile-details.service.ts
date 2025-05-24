import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProfile } from '../interface/user-profile-interface';
import { Observable } from 'rxjs';
import { apiConfig } from '../configs/api-config';
import { AuthLoginRegisterService } from '../auth/auth-login-register.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileDetailsService {  
  private user_id: number;

  constructor(
    private http: HttpClient,
    private authLoginRegisterService: AuthLoginRegisterService

  ) {
    this.user_id = this.authLoginRegisterService.getUserID();
   }

  profileDetails(): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<any>(`${apiConfig.apiBaseUrl}/user/profile/details/${this.user_id}`, {headers});
  }

  profileUpdate(userProfileUpdateRequest: UserProfile): Observable<any> {
      const headers = new HttpHeaders({'Content-Type': 'application/json'});   
      return this.http.put<any>(`${apiConfig.apiBaseUrl}/user/profile/update`, userProfileUpdateRequest, {headers});
  }

  profilePictureUpdate(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('picture', file);
    formData.append('userId', userId.toString());

    return this.http.post(`${apiConfig.apiBaseUrl}/user/profile/upload`, formData);
  }

}
