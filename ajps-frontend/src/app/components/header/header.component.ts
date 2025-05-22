import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  showSearch = false;
  searchQuery = '';

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  onSearch() {
    if (this.searchQuery.trim()) {
     
      console.log(`External search for: ${this.searchQuery}`);
      // Example: window.location.href = `https://scholar.google.com/scholar?q=${encodeURIComponent(this.searchQuery)}`;
      
    }
  }

}
