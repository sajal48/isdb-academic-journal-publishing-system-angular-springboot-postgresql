import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Manuscript } from '../../user/user-manuscript/user-manuscript.component';
import { of } from 'rxjs/internal/observable/of';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class UserManuscriptService {

  // Base URL for your Spring Boot backend
  private baseUrl = 'http://localhost:8090/api/user/submission'; // Adjust if your backend runs on a different port or path

  constructor(private http: HttpClient) { } // Inject HttpClient

  // This method now fetches data from the backend
  getManuscriptById(userId: number, submissionId: string): Observable<Manuscript | undefined> {
    const url = `${this.baseUrl}/details/${userId}/${submissionId}`;
    console.log(`Fetching manuscript from: ${url}`);

    return this.http.get<any>(url).pipe(
      map(response => {
        if (response && response.code === 200 && response.status === 'success' && response.data) {
          const backendData = response.data;
          console.log('Backend response data:', backendData);

          // Map backend data to your frontend Manuscript interface
          const manuscript: Manuscript = {
            id: backendData.id,
            submissionNumber: backendData.submissionNumber,
            title: backendData.manuscriptTitle,
            journalName: backendData.journal ? backendData.journal.journalName : 'N/A',
            submissionDate: new Date(backendData.submittedAt || backendData.createdAt),
            author: backendData.authors && backendData.authors.length > 0 ? backendData.authors[0].name : 'N/A',
            abstract: backendData.abstractContent,
            files: backendData.files ? backendData.files.map((file: any) => ({
              id: file.id, // Include file ID
              name: file.originalName,
              url: file.fileUrl,
              size: (file.size / 1024).toFixed(2), // Convert bytes to KB
              storedName: file.storedName // Might be useful for debugging or specific backend calls
            })) : [],
            status: {
              submission: backendData.submissionStatus,
              review: 'Not Started',
              copyEditing: 'Not Started',
              production: 'Not Started',
              publication: 'Not Published'
            },
            review: {
              startDate: new Date(),
              reviewers: backendData.submissionReviewers ? backendData.submissionReviewers.map((reviewer: any) => ({
                name: reviewer.name,
                status: 'Pending',
                comments: ''
              })) : [],
              decision: ''
            },
            copyEditing: {
              startDate: new Date(),
              editor: 'N/A',
              changes: []
            },
            production: {
              startDate: new Date(),
              typesetting: 'N/A',
              proofs: []
            },
            publication: {
              status: 'Not Published',
              date: null,
              doi: '',
              volumeIssue: '',
              accessType: 'Open Access',
              url: ''
            },
            discussions: []
          };
          return manuscript;
        } else {
          console.error('Backend response structure is not as expected:', response);
          return undefined;
        }
      }),
      catchError(error => {
        console.error('Error fetching manuscript:', error);
        return of(undefined); // Return Observable of undefined on error
      })
    );
  }

  // --- NEW: Upload File Method ---
uploadManuscriptFile(submissionId: number, file: File): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileOrigin', 'PRE_REVIEW');
  formData.append('submissionId', submissionId.toString()); // Backend expects Long

  return this.http.post<any>(`${this.baseUrl}/manuscript-files/upload`, formData).pipe(
    catchError(error => {
      console.error('Error uploading file:', error);
      return throwError(() => error); // Corrected
    })
  );
}

// --- NEW: Delete File Method ---
deleteManuscriptFile(submissionId: number, fileId: number): Observable<any> {
  return this.http.delete<any>(`${this.baseUrl}/manuscript-files/remove/${submissionId}/${fileId}`).pipe(
    catchError(error => {
      console.error('Error deleting file:', error);
      return throwError(() => error); // Corrected
    })
  );
}


}