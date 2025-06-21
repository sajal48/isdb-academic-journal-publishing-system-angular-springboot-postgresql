import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiConfig } from '../configs/api-config';

@Injectable({
  providedIn: 'root'
})
export class AdminOperationsService {

  constructor(
    private http: HttpClient

  ) {}

  createNewUser(payload: any): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(`${apiConfig.apiBaseUrl}/user/admin/create-new-user`, payload, {headers});
  }

  getAllUsers(): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get<any>(`${apiConfig.apiBaseUrl}/user/admin/get-user-details`, {headers});
  }

  updateUser(id: number, userData: any) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put<any>(`${apiConfig.apiBaseUrl}/user/admin/update-user-details/${id}`, userData, {headers});
  }

}
