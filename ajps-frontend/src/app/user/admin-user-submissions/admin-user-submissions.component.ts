import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-user-submissions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-user-submissions.component.html',
  styleUrl: './admin-user-submissions.component.css'
})
export class AdminUserSubmissionsComponent {

  journals = [
    { id: '1', journalName: 'Sample Journal' },
    { id: '2', journalName: 'Science Review' }
  ];

  submissions = [
    {
      id: 'S001',
      journalId: '1',
      title: 'Quantitative Ethnobotanical Study...',
      status: 'New',
      submittedDate: new Date('2025-06-17')
    },
    {
      id: 'S002',
      journalId: '2',
      title: 'Quantitative Ethnobotanical Study...',
      status: 'Assigned',
      submittedDate: new Date('2025-06-15')
    },
    {
      id: 'S003',
      journalId: '1',
      title: 'Quantitative Ethnobotanical Study...',
      status: 'In Review',
      submittedDate: new Date('2025-05-20')
    },
    {
      id: 'S004',
      journalId: '2',
      title: 'Quantitative Ethnobotanical Study...',
      status: 'In Copy Edit',
      submittedDate: new Date('2025-06-14')
    },
    {
      id: 'S005',
      journalId: '2',
      title: 'Quantitative Ethnobotanical Study...',
      status: 'Production',
      submittedDate: new Date('2025-04-10')
    },
    {
      id: 'S006',
      journalId: '1',
      title: 'Quantitative Ethnobotanical Study...',
      status: 'Publication',
      submittedDate: new Date('2025-03-01')
    }
  ];

  getSubmissionsByStatus(status: string) {
    return this.submissions.filter(sub => sub.status === status);
  }

  getJournalName(journalId: string) {
    return this.journals.find(j => j.id === journalId)?.journalName || 'Unknown';
  }

  viewSubmission(id: string) {
    alert(`Viewing submission ${id}`);
  }

  assignSubmission(id: string) {
    const submission = this.submissions.find(sub => sub.id === id);
    if (submission) {
      submission.status = 'Assigned';
      alert(`Submission ${id} assigned successfully!`);
    }
  }

}
