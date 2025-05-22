import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthRegisterLoginRequest } from '../interface/auth-register-login-request';
import { Observable } from 'rxjs/internal/Observable';
import { apiConfig } from '../configs/api-config';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class AuthLoginRegisterService {
  private readonly tokenKey = 'ajps_access_token';
  private roleSubject = new BehaviorSubject<string | null>(null);

  constructor(
    private http: HttpClient

  ) {}

  register(registerRequest: AuthRegisterLoginRequest): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${apiConfig.apiBaseUrl}/auth/register`, registerRequest, {headers});
  }

  login(loginRequest: AuthRegisterLoginRequest): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${apiConfig.apiBaseUrl}/auth/login`, loginRequest, {headers});
  }


  setToken(token: string) {
    sessionStorage.setItem(this.tokenKey, token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.roleSubject.next(payload.role);
  }

  getRole() {
    return this.roleSubject.asObservable();
  }

  getToken() {
    return sessionStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role.toLowerCase();
  }

  logout() {
    sessionStorage.removeItem(this.tokenKey);
    this.roleSubject.next(null);
    window.location.href="/login";
  }

}
