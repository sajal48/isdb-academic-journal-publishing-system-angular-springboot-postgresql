import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

declare const bootstrap: any;

interface Journal {
  id: number;
  name: string;
}

interface Issue {
  id: number;
  volume: number;
  number: number;
  publicationDate: Date;
  status: 'Published' | 'Future';
  papers: Paper[];
}

interface Paper {
  id: number;
  title: string;
  authors: string;
  status: string;
}

@Component({
  selector: 'app-admin-journal-publication',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-journal-publication.component.html',
  styleUrl: './admin-journal-publication.component.css'
})
export class AdminJournalPublicationComponent implements OnInit {
  journals: Journal[] = [
    { id: 1, name: 'Journal of Science' },
    { id: 2, name: 'Journal of Technology' }
  ];
  selectedJournal: number = 1;
  issues: Issue[] = [
    { id: 1, volume: 1, number: 1, publicationDate: new Date('2025-01-15'), status: 'Published', papers: [
      { id: 1, title: 'Quantum Computing Advances', authors: 'John Doe, Jane Smith', status: 'Published' },
      { id: 2, title: 'AI in Healthcare', authors: 'Alice Brown', status: 'Published' }
    ]},
    { id: 2, volume: 1, number: 2, publicationDate: new Date('2025-06-30'), status: 'Future', papers: []}
  ];
  currentTab: 'published' | 'future' = 'published';
  selectedIssue: Issue | null = null;

  ngOnInit() {
    this.loadIssues();
  }

  loadIssues() {
    // Fetch issues for selected journal (mock implementation)
    // In real app, this would be an API call
  }

  getFilteredIssues(): Issue[] {
    return this.issues.filter(issue => issue.status === this.currentTab.charAt(0).toUpperCase() + this.currentTab.slice(1));
  }

  openAddIssueModal() {
    // Implement modal logic to add new issue
    console.log('Open add issue modal');
  }

  viewPapers(issue: Issue) {
    this.selectedIssue = issue;
    const modal = new bootstrap.Modal(document.getElementById('papersModal')!);
    modal.show();
  }

  editIssue(issue: Issue) {
    // Implement edit issue logic
    console.log('Edit issue:', issue);
  }

  deleteIssue(issue: Issue) {
    this.issues = this.issues.filter(i => i.id !== issue.id);
  }

  addPaper() {
    // Implement add paper logic
    console.log('Add paper to issue:', this.selectedIssue);
  }

  editPaper(paper: Paper) {
    // Implement edit paper logic
    console.log('Edit paper:', paper);
  }

  deletePaper(paper: Paper) {
    if (this.selectedIssue) {
      this.selectedIssue.papers = this.selectedIssue.papers.filter(p => p.id !== paper.id);
    }
  }

  selectSection(section: string) {
    // Implement section navigation logic
    console.log('Navigate to:', section);
  }
}
