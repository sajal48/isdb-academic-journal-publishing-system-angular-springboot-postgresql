import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-user-header',
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.css'
})
export class UserHeaderComponent {
  showSearch = false;
  searchQuery = '';
  searchType = 'internal'; // Default to internal search

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      if (this.searchType === 'internal') {
        // Placeholder: Implement internal search logic (e.g., navigate to search results)
        console.log(`Internal search for: ${this.searchQuery}`);
      } else {
        // Placeholder: Implement external search (e.g., redirect to Google Scholar)
        console.log(`External search for: ${this.searchQuery}`);
        // Example: window.location.href = `https://scholar.google.com/scholar?q=${encodeURIComponent(this.searchQuery)}`;
      }
    }
  }

}
