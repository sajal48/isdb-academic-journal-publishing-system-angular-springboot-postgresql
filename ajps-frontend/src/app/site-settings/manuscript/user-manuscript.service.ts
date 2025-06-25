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
  private journalUrl = 'http://localhost:8090/api/journal';
  private publicationUrl = 'http://localhost:8090/api/publication'; // Base URL for publication actions

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
              status: backendData.submissionStatus === 'PUBLISHED' ? 'Published' : 'Not Published', // Derive from submissionStatus
              date: backendData.publicationDate ? new Date(backendData.publicationDate) : null, // Assuming backend provides this
              doi: backendData.doi || '',
              volumeIssue: backendData.volumeIssue || '',
              accessType: backendData.accessType || 'Open Access', // Assuming default or provided
              url: backendData.publishedUrl || '' // Assuming published URL
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

  getAllJournals(): Observable<Journal[]> {
    return this.http.get<Journal[]>(`${this.journalUrl}/get-all-journals`).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response;
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

  deleteManuscriptFile(submissionId: number, fileId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/manuscript-files/remove/${submissionId}/${fileId}`).pipe(
      catchError(error => {
        console.error('Error deleting file:', error);
        return throwError(() => error);
      })
    );
  }

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

  createDiscussion(submissionId: number, creatorId: number, title: string, content: string, origin: DiscussionOrigin): Observable<Discussion> {
    const body = { title, content, origin };

    return this.http.post<any>(`${this.discussionUrl}/${submissionId}/discussions/create/${creatorId}`, body).pipe(
      map(response => {
        if (response && response.code === 201 && response.status === 'success' && response.data) {
          const d = response.data;
          return {
            id: d.id,
            submissionId: d.submissionId,
            creatorId: d.creatorId,
            creatorName: d.creatorName,
            title: d.title,
            content: d.content,
            origin: d.origin,
            createdAt: new Date(d.createdAt)
          };
        }
        throw new Error('Failed to create discussion: Unexpected response from server.');
      }),
      catchError(error => {
        console.error('Error creating discussion:', error);
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

  publishArticle(submissionId: number, issueId: number, fileId: number): Observable<any> {
    const url = `${this.publicationUrl}/publish-article/${submissionId}/${issueId}/${fileId}`;
    return this.http.post<any>(url, {}).pipe(
      map(response => {
        if (response && response.code === 201 && response.status === 'success') {
          return response;
        } else {
          throw new Error(response?.message || 'Failed to publish article: Unexpected response');
        }
      }),
      catchError(error => {
        console.error('Error publishing article:', error);
        const errorMessage = error.error?.message || error.statusText || 'Server error during article publication.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Sends a DELETE request to unpublish an article by removing its Paper record from the database.
   *
   * @param submissionId The ID of the submission corresponding to the article to unpublish.
   * @returns An Observable that emits the response from the server.
   */
  unpublishArticle(submissionId: number): Observable<any> {
    const url = `${this.publicationUrl}/unpublish-article/${submissionId}`;
    console.log(`Sending DELETE request to unpublish article: ${url}`);
    return this.http.delete<any>(url).pipe(
      map(response => {
        if (response && response.code === 200 && response.status === 'success') {
          console.log(`Unpublish successful: ${response.message}`);
          return response;
        } else {
          throw new Error(response?.message || 'Failed to unpublish article: Unexpected response');
        }
      }),
      catchError(error => {
        console.error('Error unpublishing article:', error);
        const errorMessage = error.error?.message || error.statusText || 'Server error during article unpublication.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}