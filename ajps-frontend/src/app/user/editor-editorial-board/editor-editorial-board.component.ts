import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface EditorialBoardMember {
  profileId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  designation: string;
  affiliation?: string; // Optional field if available in your backend
}

@Component({
  selector: 'app-editor-editorial-board',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './editor-editorial-board.component.html',
  styleUrls: ['./editor-editorial-board.component.css']
})
export class EditorEditorialBoardComponent implements OnInit {
  editorialBoard: EditorialBoardMember[] = [];
  isLoading = true;
  errorMessage = '';
  apiUrl: string = 'http://localhost:8090' // Your backend API URL

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchEditorialBoard();
  }

  fetchEditorialBoard(): void {
    this.isLoading = true;
    // Assuming you want to fetch for a specific journal (e.g., journalId = 1)
    // You might want to make this dynamic based on route parameters
    const journalId = 1;
    
    this.http.get<EditorialBoardMember[]>(`${this.apiUrl}/api/editorial-board/journal/${journalId}`)
      .subscribe({
        next: (data) => {
          this.editorialBoard = data;
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = 'Failed to load editorial board. Please try again later.';
          this.isLoading = false;
          console.error('Error fetching editorial board:', error);
        }
      });
  }

  getFullName(member: EditorialBoardMember): string {
    return `${member.firstName} ${member.middleName ? member.middleName + ' ' : ''}${member.lastName}`;
  }
}