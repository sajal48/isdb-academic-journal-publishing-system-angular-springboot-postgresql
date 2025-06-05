export interface SubmissionList {
  id: number;
  journalName: string;
  manuscriptTitle: string;
  manuscriptCategory: string;
  submissionStatus: string;
  submittedAt: string;
  updatedAt: string;
  paymentDue: boolean;
  editable: boolean;
}
