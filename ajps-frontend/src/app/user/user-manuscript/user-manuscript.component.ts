import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserManuscriptService } from '../../site-settings/manuscript/user-manuscript.service';
import { AuthLoginRegisterService } from '../../site-settings/auth/auth-login-register.service';

export interface ManuscriptAuthor {
  id: number;
  name: string;
  email: string;
  institution: string;
  corresponding: boolean;
  orcid?: string;
}

export interface Manuscript {
  id: string;
  submissionNumber?: number;
  title: string;
  journalName: string;
  submissionDate: Date;
  lastUpdate: Date;
  submissionStatus: string;
  manuscriptKeywords?: string;
  manuscriptCategory: string;
  abstract?: string;
  files?: SubmissionFile[];
  status?: {
    submission: string;
    review: string;
    copyEditing: string;
    production: string;
    publication: string;
  };
  review?: {
    startDate: Date;
    reviewers: { name: string; status: string; comments: string }[];
    decision: string;
  };
  copyEditing?: {
    startDate: Date;
    editor: string;
    changes: { description: string; status: string }[];
  };
  production?: {
    startDate: Date;
    typesetting: string;
    proofs: { name: string; url: string; sentDate: Date }[];
  };
  publication?: {
    status: string;
    date: Date | null;
    doi: string;
    volumeIssue: string;
    accessType: string;
    url: string;
  };
  discussions?: Discussion[];
  authors?: ManuscriptAuthor[];
  owner: ManuscriptOwner;
  isEditable?: boolean;
  journal?: {
    id: number;
    journalName: string;
  };
}

// --- SIMPLIFIED INTERFACE FOR DISCUSSIONS ---
export interface Discussion {
  id: number;
  submissionId: number;
  creatorId: number;
  creatorName: string;
  title: string;
  content: string;
  origin: DiscussionOrigin; // <-- Add this
  createdAt: Date; // Or Date, depending on how you handle dates
}

export interface SubmissionFile {
  id: number;
  name: string;
  url: string;
  size: any;
  storedName?: string;
  isReviewFile?: boolean;
  isCopyEditingFile?: boolean;
  fileOrigin?: string;
  isProductionFile?: boolean; // Add this new property
  isPublicationFile?: boolean;
}

export interface Reviewer {
  id?: number;
  name: string;
  email: string;
  institution: string;
  status?: string; // e.g., 'PENDING', 'COMPLETED', 'ACCEPTED'
  comments?: string; // Reviewer comments
}

export enum DiscussionOrigin {
  PRE_REVIEW = 'PRE_REVIEW',
  IN_REVIEW = 'IN_REVIEW',
  POST_REVIEW = 'POST_REVIEW',
  EDITORIAL = 'EDITORIAL',
  AUTHOR_QUERY = 'AUTHOR_QUERY',
  TECHNICAL_SUPPORT = 'TECHNICAL_SUPPORT',
  COPY_EDIT = 'COPY_EDIT',
  PRODUCTION = 'PRODUCTION',
  // Ensure this matches your Java enum values exactly
}

export interface ManuscriptOwner {
  userId: number;
  // Add other owner properties if needed, e.g., name: string;
}

@Component({
  selector: 'app-user-manuscript',
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './user-manuscript.component.html',
  styleUrl: './user-manuscript.component.css',
  standalone: true
})
export class UserManuscriptComponent implements OnInit {
  manuscript!: Manuscript; // Use definite assignment assertion if you initialize in ngOnInit

  // IMPORTANT: Replace with a dynamic userId from authentication or user session
  // For now, hardcode a placeholder or get from route if you have a /user/:userId/manuscript/:manuscriptId route
  private currentUserId: number = 0; // <<--- SET A VALID USER ID HERE (e.g., from logged-in user)
  othersUserId: number = 0;
  currentUserRole: string = '';

  constructor(
    private route: ActivatedRoute,
    private manuscriptService: UserManuscriptService,
    private authLoginRegisterService: AuthLoginRegisterService
  ) { }

  ngOnInit(): void {
    this.currentUserRole = this.authLoginRegisterService.getUserRole();
    
    this.othersUserId = this.route.snapshot.queryParams['userId'];
    if (this.othersUserId == null) {
      this.currentUserId = this.authLoginRegisterService.getUserID();
    } else {
      this.currentUserId = this.othersUserId;
    }

    this.route.paramMap.pipe(
      switchMap(params => {
        const manuscriptId = params.get('manuscriptId');
        if (manuscriptId && this.currentUserId) {
          // Pass both userId and manuscriptId to the service
          return this.manuscriptService.getManuscriptById(this.currentUserId, manuscriptId);
        }
        return of(undefined);
      })
    ).subscribe(manuscript => {
      if (manuscript) {
        this.manuscript = manuscript;
        console.log('Manuscript loaded:', this.manuscript);
      } else {
        console.error('Manuscript not found or ID/User ID missing.');
        // Optionally navigate to an error page or show a message
      }
    });
  }

  getArticleType(category: string): string {
    const types: Record<string, string> = {
      research: 'Research Article',
      review: 'Review Article',
      short: 'Short Communication',
      editorial: 'Editorial'
    };
    return types[category] || 'Article';
  }

}