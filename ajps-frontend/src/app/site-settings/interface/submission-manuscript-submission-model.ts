import { Reviewer } from "./submission-reviewer-model";

export interface ManuscriptSubmission {
  journal: string;
  articleTitle: string;
  articleCategory: string;
  abstractContent: string;
  keywords: string;
  correspondingAuthor: string;
  authorEmail: string;
  institution: string;
  manuscriptFile: string | null; // Changed to string | null for Base64 content
  fileName: string | null; // Stores the original file name
  reviewers: Reviewer[];
  comments: string;
}
