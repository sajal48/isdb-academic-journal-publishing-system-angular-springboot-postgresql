// journals.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { JournalDetailsService } from '../site-settings/services/journal-details.service';

@Component({
  selector: 'app-journals',
  standalone: true,
  imports: [RouterLink, CommonModule, HttpClientModule],
  templateUrl: './journals.component.html',
  styleUrl: './journals.component.css'
})
export class JournalsComponent implements OnInit {
  journals: any[] = [];
  isLoading: boolean = true;

  constructor(private journalService: JournalDetailsService) { }

  ngOnInit(): void {
    this.loadJournals();
  }

  loadJournals(): void {
    this.journalService.getAllJournals().subscribe({
      next: (data) => {
        this.journals = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching journals:', error);
        this.isLoading = false;
      }
    });
  }
}