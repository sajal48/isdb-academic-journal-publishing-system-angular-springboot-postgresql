// service ts:
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Discussion, DiscussionOrigin, Manuscript } from '../../user/user-manuscript/user-manuscript.component';
import { of } from 'rxjs';

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
            submissionStatus: backendData.submissionStatus,
            author: backendData.authors && backendData.authors.length > 0 ? backendData.authors[0].name : 'N/A',
            abstract: backendData.abstractContent,
            files: backendData.files ? backendData.files.map((file: any) => ({
              id: file.id, // Include file ID
              name: file.originalName,
              url: file.fileUrl,
              size: (file.size / 1024).toFixed(2), // Convert bytes to KB
              storedName: file.storedName, // Might be useful for debugging or specific backend calls
              fileOrigin: file.fileOrigin,
              isReviewFile: file.reviewFile,
              isCopyEditingFile: file.copyEditingFile
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
            discussions: [],
            owner: {
              userId: backendData.owner.userId
            }
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

  /**
   * Creates a new discussion for a given submission.
   * This method is updated to align with the backend controller's endpoint signature.
   * @param submissionId The ID of the submission to which the discussion belongs.
   * @param creatorId The ID of the user creating the discussion (now a path variable).
   * @param title The title of the discussion.
   * @param content The initial message content of the discussion.
   * @param origin The origin/category of the discussion (e.g., 'PRE_REVIEW', 'EDITORIAL').
   * @returns An Observable that emits the newly created Discussion object.
   */
  createDiscussion(submissionId: number, creatorId: number, title: string, content: string, origin: DiscussionOrigin): Observable<Discussion> {
    // Construct the request body with title, content, and origin
    const body = { title, content, origin };

    // FIX HERE: Use this.discussionUrl as the base for discussion creation
    return this.http.post<any>(`${this.discussionUrl}/${submissionId}/discussions/create/${creatorId}`, body).pipe(
      map(response => {
        // Check for successful response structure from the backend's SuccessResponseModel
        if (response && response.code === 201 && response.status === 'success' && response.data) {
          const d = response.data;
          // Map the backend DiscussionResponse DTO to the frontend Discussion interface
          return {
            id: d.id,
            submissionId: d.submissionId,
            creatorId: d.creatorId,
            creatorName: d.creatorName, // Assuming the backend returns creatorName
            title: d.title,
            content: d.content,
            origin: d.origin, // Assuming the backend returns the enum value directly
            createdAt: new Date(d.createdAt) // Convert to Date object
          };
        }
        throw new Error('Failed to create discussion: Unexpected response from server.');
      }),
      catchError(error => {
        console.error('Error creating discussion:', error);
        // Extract a more specific error message if available, otherwise use a generic one
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

  addReviewFileReference(manuscriptId: number, fileId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${manuscriptId}/send-to-review`, { fileId }); // This works directly with the DTO
  }

  acceptAndSkipReview(submissionId: number): Observable<any> {
    // The endpoint is PUT /api/user/submission/{submissionId}/accept-skip-review
    // No request body is needed for this operation.
    return this.http.put(`${this.baseUrl}/${submissionId}/accept-skip-review`, {});
  }

  // --- NEW METHOD: SELECT FILE FOR COPY EDITING ---
  selectFileForCopyEditing(submissionId: number, fileId: number): Observable<any> {
    // The endpoint is PUT /api/user/submission/{submissionId}/select-copy-editing-file
    // The backend expects a request body like { fileId: fileId }
    return this.http.put(`${this.baseUrl}/${submissionId}/select-copy-editing-file`, { fileId }).pipe(
      map((response: any) => {
        if (response && response.code === 200 && response.status === 'success') {
          return response;
        } else {
          throw new Error(response?.message || 'Failed to select file for copy-editing: Unexpected response');
        }
      }),
      catchError(error => {
        console.error('Error selecting file for copy-editing:', error);
        return throwError(() => new Error(error.error?.message || error.statusText || 'Server error during file selection.'));
      })
    );
  }

  uploadRevisionFile(submissionId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file); // Append the actual File object
    // No need for 'fileOrigin' here as the backend endpoint specifically handles 'REVISION'
    // formData.append('fileOrigin', 'REVISION'); // This is handled by backend logic for this specific endpoint

    return this.http.post<any>(`${this.baseUrl}/${submissionId}/upload-revision-file`, formData).pipe(
      map(response => {
        if (response && response.code === 200 && response.status === 'success') {
          return response;
        } else {
          throw new Error(response?.message || 'Failed to upload revision file: Unexpected response');
        }
      }),
      catchError(error => {
        console.error('Error uploading revision file:', error);
        const errorMessage = error.error?.message || error.statusText || 'Server error during revision file upload.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  uploadCopyeditedFile(submissionId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    // The backend endpoint specifically marks this as 'COPY_EDIT' origin

    return this.http.post<any>(`${this.baseUrl}/${submissionId}/upload-copyedited-file`, formData).pipe(
      map(response => {
        if (response && response.code === 200 && response.status === 'success') {
          return response;
        } else {
          throw new Error(response?.message || 'Failed to upload copyedited file: Unexpected response');
        }
      }),
      catchError(error => {
        console.error('Error uploading copyedited file:', error);
        const errorMessage = error.error?.message || error.statusText || 'Server error during copyedited file upload.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  
  // Add this method to UserManuscriptService
selectFileForProduction(submissionId: number, fileId: number): Observable<any> {
  debugger
    return this.http.put(`${this.baseUrl}/${submissionId}/select-production-file`, { fileId }).pipe(
        map((response: any) => {
            if (response && response.code === 200 && response.status === 'success') {
                return response;
            } else {
                throw new Error(response?.message || 'Failed to select file for production: Unexpected response');
            }
        }),
        catchError(error => {
            console.error('Error selecting file for production:', error);
            return throwError(() => new Error(error.error?.message || error.statusText || 'Server error during file selection.'));
        })
    );
}

}