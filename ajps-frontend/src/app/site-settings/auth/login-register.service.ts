import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { apiConfig } from '../api-config';
import { Observable } from 'rxjs';
import { UserRegisterRequest } from '../interface/user-register-request';
import { UserRegisterResponse } from '../interface/user-register-response';

@Injectable({
  providedIn: 'root'
})
export class LoginRegisterService {

  private readonly tokenKey = 'access_token';

  constructor(
    private router: Router,
    private http: HttpClient

  ) {}

  register(registerRequest: UserRegisterRequest): Observable<UserRegisterResponse> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${apiConfig.apiBaseUrl}/auth/register`, registerRequest, {headers});
  }

  login(credentials: {email: string; password: string}) {
    return this.http.post<any>(`${apiConfig.apiBaseUrl}/auth/login`, credentials);
  }

}
