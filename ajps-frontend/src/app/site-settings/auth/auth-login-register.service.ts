import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRegisterRequest } from '../interface/auth-register-request';
import { Observable } from 'rxjs/internal/Observable';
import { apiConfig } from '../configs/api-config';

@Injectable({
  providedIn: 'root'
})
export class AuthLoginRegisterService {

  constructor(
    private http: HttpClient

  ) {}

  register(registerRequest: AuthRegisterRequest): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${apiConfig.apiBaseUrl}/auth/register`, registerRequest, {headers});
  }

  login(credentials: {email: string; password: string}) {
    return this.http.post<any>(`${apiConfig.apiBaseUrl}/auth/login`, credentials);
  }

}
