import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthLoginRegisterService } from '../../site-settings/auth/auth-login-register.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  showSearch = false;
  searchQuery = '';
  userName = '';
  isLoggedIn = false;
  userRole: string = '';

  constructor(
    private authLoginRegisterService: AuthLoginRegisterService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.authLoginRegisterService.isAuthenticated().subscribe({
      next: (isValid) => {
        if (isValid) {
          const email = this.authLoginRegisterService.getUserEmail();
          this.userName = email ? email.split('@')[0] : '';
          this.isLoggedIn = true;
          this.userRole = this.authLoginRegisterService.getUserRole();
        }
      },
      error: () => {
        this.isLoggedIn = false;
        this.authLoginRegisterService.deleteToken();
      }
    });
  }


  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  onSearch() {
    if (this.searchQuery.trim()) {

      console.log(`External search for: ${this.searchQuery}`);
      // Example: window.location.href = `https://scholar.google.com/scholar?q=${encodeURIComponent(this.searchQuery)}`;

    }
  }

  logout() {
    this.authLoginRegisterService.logout(this.router.url);
    // this.authLoginRegisterService.logout('/login');
  }

}
