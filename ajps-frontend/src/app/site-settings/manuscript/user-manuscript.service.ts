import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Discussion, DiscussionOrigin, Manuscript, ManuscriptAuthor, SubmissionFile } from '../../user/user-manuscript/user-manuscript.component';

// Define the Journal and JournalIssue interfaces as they will be received from the backend
export interface Journal {
  id: number;
  journalName: string;
  issn: string;
  frequency: string;
  journalType: string;
  journalCode: string;
  contactEmail: string;
  journalUrl: string;
  aimsScopes: string;
  aboutJournal: string;
  coverImageUrl: string;
  issues: JournalIssue[];
}

export interface JournalIssue {
  id: number;
  number: number;
  volume: number;
  status: string; // e.g., "Future", "Published"
  publicationDate: string; // Assuming string format like "YYYY-MM-DD"
}

@Injectable({
  providedIn: 'root'
})
export class UserManuscriptService {
  private baseUrl = 'http://localhost:8090/api/user/submission';
  private discussionUrl = 'http://localhost:8090/api/user/discussion';
  private journalUrl = 'http://localhost:8090/api/journal'; // Base URL for journal API

  constructor(private http: HttpClient) {}

  getManuscriptById(userId: number, submissionId: string): Observable<Manuscript | undefined> {
    const url = `${this.baseUrl}/details/${userId}/${submissionId}`;
    console.log(`Fetching manuscript from: ${url}`);

    return this.http.get<any>(url).pipe(
      map(response => {
        if (response && response.code === 200 && response.status === 'success' && response.data) {
          const backendData = response.data;
          console.log('Backend response data:', backendData);

          // Map authors data
          const authors: ManuscriptAuthor[] = backendData.authors?.map((author: any) => ({
            id: author.id,
            name: author.name,
            email: author.email,
            institution: author.institution,
            corresponding: author.corresponding,
            orcid: author.orcid
          })) || [];

          // Map files data
          const files: SubmissionFile[] = backendData.files?.map((file: any) => ({
            id: file.id,
            name: file.originalName,
            url: file.fileUrl,
            size: file.size,
            storedName: file.storedName,
            fileOrigin: file.fileOrigin,
            isReviewFile: file.reviewFile,
            isCopyEditingFile: file.copyEditingFile,
            isProductionFile: file.productionFile,
            isPublicationFile: file.publicationFile
          })) || [];

          const manuscript: Manuscript = {
            id: backendData.id.toString(),
            submissionNumber: backendData.submissionNumber,
            title: backendData.manuscriptTitle,
            journalName: backendData.journal?.journalName || 'N/A',
            submissionDate: new Date(backendData.submittedAt || backendData.createdAt),
            lastUpdate: new Date(backendData.updatedAt || backendData.submittedAt),
            submissionStatus: backendData.submissionStatus,
            manuscriptKeywords: backendData.manuscriptKeywords,
            abstract: backendData.abstractContent,
            files: files,
            status: {
              submission: backendData.submissionStatus,
              review: 'Not Started',
              copyEditing: 'Not Started',
              production: 'Not Started',
              publication: 'Not Published'
            },
            review: {
              startDate: new Date(),
              reviewers: backendData.submissionReviewers?.map((reviewer: any) => ({
                name: reviewer.name,
                status: 'Pending',
                comments: ''
              })) || [],
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
            authors: authors,
            owner: {
              userId: backendData.owner.userId
            },
            journal: backendData.journal
          };
          return manuscript;
        } else {
          console.error('Backend response structure is not as expected for manuscript details:', response);
          return undefined;
        }
      }),
      catchError(error => {
        console.error('Error fetching manuscript:', error);
        return of(undefined);
      })
    );
  }

  // --- MODIFIED: Method to get all journals and their issues ---
  getAllJournals(): Observable<Journal[]> {
    // The backend response is a direct array of Journal objects, not wrapped in a success model.
    return this.http.get<Journal[]>(`${this.journalUrl}/get-all-journals`).pipe( // Directly cast to Journal[]
      map(response => {
        if (Array.isArray(response)) { // Check if it's an array
          return response; // Return the array directly
        }
        console.error('Backend response for journals is not an array as expected:', response);
        return [];
      }),
      catchError(error => {
        console.error('Error fetching journals:', error);
        return of([]);
      })
    );
  }

  // --- NEW: Upload File Method ---
  uploadManuscriptFile(submissionId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileOrigin', 'PRE_REVIEW');
    formData.append('submissionId', submissionId.toString());

    return this.http.post<any>(`${this.baseUrl}/manuscript-files/upload`, formData).pipe(
      catchError(error => {
        console.error('Error uploading file:', error);
        return throwError(() => error);
      })
    );
  }

  // --- NEW: Delete File Method ---
  deleteManuscriptFile(submissionId: number, fileId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/manuscript-files/remove/${submissionId}/${fileId}`).pipe(
      catchError(error => {
        console.error('Error deleting file:', error);
        return throwError(() => error);
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
            createdAt: new Date(d.createdAt)
          }));
        }
        console.error('Backend response structure is not as expected for discussions:', response);
        return [];
      }),
      catchError(error => {
        console.error('Error fetching discussions:', error);
        return of([]);
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
        const errorMessage = error.error?.message || error.statusText || 'Server error during status update.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  addReviewFileReference(manuscriptId: number, fileId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${manuscriptId}/send-to-review`, { fileId });
  }

  acceptAndSkipReview(submissionId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${submissionId}/accept-skip-review`, {});
  }

  // --- NEW METHOD: SELECT FILE FOR COPY EDITING ---
  selectFileForCopyEditing(submissionId: number, fileId: number): Observable<any> {
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
    formData.append('file', file);

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

  selectFileForProduction(submissionId: number, fileId: number): Observable<any> {
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

  uploadProductionFile(submissionId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.baseUrl}/${submissionId}/upload-production-file`, formData).pipe(
      map(response => {
        if (response && response.code === 200 && response.status === 'success') {
          return response;
        } else {
          throw new Error(response?.message || 'Failed to upload production file: Unexpected response');
        }
      }),
      catchError(error => {
        console.error('Error uploading production file:', error);
        const errorMessage = error.error?.message || error.statusText || 'Server error during production file upload.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  selectFileForPublication(submissionId: number, fileId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${submissionId}/select-publication-file`, { fileId }).pipe(
      map((response: any) => {
        if (response && response.code === 200 && response.status === 'success') {
          return response;
        } else {
          throw new Error(response?.message || 'Failed to select file for publication: Unexpected response');
        }
      }),
      catchError(error => {
        console.error('Error selecting file for publication:', error);
        return throwError(() => new Error(error.error?.message || error.statusText || 'Server error during file selection.'));
      })
    );
  }
}