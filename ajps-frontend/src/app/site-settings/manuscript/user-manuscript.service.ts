import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Discussion, Manuscript } from '../../user/user-manuscript/user-manuscript.component';
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
  private discussionUrl = 'http://localhost:8090/api/user/discussion'; // Base URL for discussions

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

// --- NEW: Get Discussions for a Submission ---
  getDiscussionsForSubmission(submissionId: number): Observable<Discussion[]> {
    return this.http.get<any>(`${this.discussionUrl}/submission/${submissionId}`).pipe(
      map(response => {
        if (response && response.code === 200 && response.status === 'success' && response.data) {
          return response.data.map((d: any) => ({
            ...d,
            createdAt: new Date(d.createdAt) // Convert to Date object
          }));
        }
        console.error('Backend response structure is not as expected for discussions:', response);
        return [];
      }),
      catchError(error => {
        console.error('Error fetching discussions:', error);
        return of([]); // Return empty array on error
      })
    );
  }

  // --- NEW: Create New Discussion (Simplified) ---
  createDiscussion(submissionId: number, userId: number, title: string, content: string): Observable<Discussion> {
    const body = { title, content }; // Use 'content' for the message
    // Pass userId as query param, as defined in backend controller
    return this.http.post<any>(`${this.discussionUrl}/${submissionId}?userId=${userId}`, body).pipe(
      map(response => {
        if (response && response.code === 201 && response.status === 'success' && response.data) {
          const d = response.data;
          return {
            ...d,
            createdAt: new Date(d.createdAt)
          };
        }
        throw new Error('Failed to create discussion: Unexpected response');
      }),
      catchError(error => {
        console.error('Error creating discussion:', error);
        return throwError(() => new Error(error.error?.message || 'Server error during discussion creation.'));
      })
    );
  }

  updateSubmissionStatus(submissionId: number, newStatus: string): Observable<any> {
    const url = `${this.baseUrl}/update-status/${submissionId}`;
    // The backend endpoint might expect a specific body, e.g., { status: newStatus }
    const body = { status: newStatus };
    console.log(`Updating submission status for ${submissionId} to ${newStatus} via ${url}`);

    return this.http.put<any>(url, body).pipe(
      map(response => {
        if (response && response.code === 200 && response.status === 'success') {
          console.log(`Status update successful: ${response.message}`);
          return response;
        } else {
          throw new Error(response?.message || 'Failed to update status: Unexpected response');
        }
      }),
      catchError(error => {
        console.error('Error updating submission status:', error);
        // Extract a more specific error message if available
        const errorMessage = error.error?.message || error.statusText || 'Server error during status update.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

}