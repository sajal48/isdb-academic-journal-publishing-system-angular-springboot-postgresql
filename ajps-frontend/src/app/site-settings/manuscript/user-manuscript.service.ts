import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Manuscript } from '../../user/user-manuscript/user-manuscript.component';
import { of } from 'rxjs/internal/observable/of';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';

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
            title: backendData.manuscriptTitle,
            journalName: backendData.journal ? backendData.journal.journalName : 'N/A', // Handle nested journal object
            submissionDate: new Date(backendData.submittedAt || backendData.createdAt), // Use submittedAt, fallback to createdAt
            author: backendData.authors && backendData.authors.length > 0 ? backendData.authors[0].name : 'N/A', // Get first author's name
            abstract: backendData.abstractContent,
            files: backendData.files ? backendData.files.map((file: any) => ({
              name: file.originalName, // Backend has originalName
              url: file.fileUrl,       // Backend has fileUrl
              size: (file.size / 1024).toFixed(2) // Convert bytes to KB and format
            })) : [],
            status: {
              submission: backendData.submissionStatus,
              review: 'Not Started', // Placeholder or derive from backend status if available
              copyEditing: 'Not Started', // Placeholder
              production: 'Not Started', // Placeholder
              publication: 'Not Published' // Placeholder
            },
            review: { // Placeholder for now; map real data when available from backend
              startDate: new Date(),
              reviewers: backendData.submissionReviewers ? backendData.submissionReviewers.map((reviewer: any) => ({
                name: reviewer.name,
                status: 'Pending', // Placeholder
                comments: '' // Placeholder
              })) : [],
              decision: ''
            },
            copyEditing: { // Placeholder
              startDate: new Date(),
              editor: 'N/A',
              changes: []
            },
            production: { // Placeholder
              startDate: new Date(),
              typesetting: 'N/A',
              proofs: []
            },
            publication: { // Placeholder
              status: 'Not Published',
              date: null,
              doi: '',
              volumeIssue: '',
              accessType: 'Open Access',
              url: ''
            },
            discussions: [] // Assuming discussions will be fetched separately or integrated later
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
}