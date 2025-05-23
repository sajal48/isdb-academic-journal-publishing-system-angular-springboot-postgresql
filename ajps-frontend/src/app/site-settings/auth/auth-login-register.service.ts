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
    localStorage.setItem(this.tokenKey, token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.roleSubject.next(payload.role);
  }

  getRole() {
    return this.roleSubject.asObservable();
  }

  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return new BehaviorSubject<boolean>(false).asObservable();
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.get<boolean>(`${apiConfig.apiBaseUrl}/auth/validate-token`, { headers });
  }  

  // isAuthenticated(): boolean {
  //   return !!this.getToken();
  // }

  getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role.toLowerCase();
  }

  getUserEmail(): string {
    const token = this.getToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.email.toLowerCase();
  }

  getUserID(): number {
    const token = this.getToken();
    if (!token) return 0;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id;
  }

  logout(targetUrl?: string): void {
    localStorage.removeItem(this.tokenKey);
    this.roleSubject.next(null);
    const redirectUrl = targetUrl || '/login'; // default fallback
    window.location.href=`${redirectUrl}`;
  }

  deleteToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.roleSubject.next(null);
  }

}
