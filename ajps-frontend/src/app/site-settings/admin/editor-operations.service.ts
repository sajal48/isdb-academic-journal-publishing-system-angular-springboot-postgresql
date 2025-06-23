import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { apiConfig } from '../configs/api-config';

@Injectable({
  providedIn: 'root'
})
export class EditorOperationsService {

  constructor(private http: HttpClient) {}

  getAllEditors(): Observable<any[]> {
    return this.http.get<any[]>(`${apiConfig.apiBaseUrl}/editors/all`);
  }

  assignJournalsToEditor(profileId: number, journalIds: number[]): Observable<any> {
  return this.http.post(`${apiConfig.apiBaseUrl}/editors/assign-journals`, {
    profileId: profileId,
    assignedJournalsIds: journalIds
  });
}



}
