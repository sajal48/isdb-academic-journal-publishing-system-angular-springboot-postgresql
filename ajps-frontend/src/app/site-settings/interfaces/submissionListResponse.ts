// src/app/dto/response/submission-list-response.ts
export interface SubmissionListResponse {
  submissionId: number; // Keep this for internal operations if needed
  submissionNumber: number; // <-- Add this field
  journalName: string;
  manuscriptTitle: string;
  submissionDate: string;
  submissionStatus: string;
  isEditable: boolean;
  isPaymentDue: boolean;
}