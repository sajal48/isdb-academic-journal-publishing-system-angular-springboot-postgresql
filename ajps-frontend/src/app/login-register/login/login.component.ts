import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthLoginRegisterService } from '../../site-settings/auth/auth-login-register.service';
import { CommonModule } from '@angular/common';
import { AuthRegisterLoginRequest } from '../../site-settings/interfaces/auth-register-login-request';
import { SafeHtml } from '@angular/platform-browser';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  user: AuthRegisterLoginRequest = {
    email: '',
    password: ''
  }

  serverError: SafeHtml | null = null;
  serverSuccess: SafeHtml | null = null;

  constructor(
    private authLoginRegisterService: AuthLoginRegisterService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.authLoginRegisterService.isAuthenticated().pipe(
      map((isValid) => {
        if (isValid) {
          // window.location.href="/user";
          this.router.navigate(['/user']);
        }
      })
    ).subscribe();
  }

  onSubmit() {
    if (!this.user.email || !this.user.password) {
      this.serverError = '<i class="bi bi-exclamation-circle"></i> All fields are required.';
      this.serverSuccess = null;
      return;
    }

    this.authLoginRegisterService.login(this.user).subscribe({
      next: (response) => {

        if (response.code === 200) {
          this.serverSuccess = `<i class="bi bi-check-circle"></i> Login successful. Please wait...`;
          this.serverError = null;

          // clear form
          this.user = {email: '', password: ''};

          this.authLoginRegisterService.setToken(response.access_token);
          // window.location.href="/user";

          if(this.authLoginRegisterService.getUserRole() == "user") {
            window.location.href="/user";
          }
          if(this.authLoginRegisterService.getUserRole() == "admin") {
            window.location.href="/user/admin-dashboard";
          }

        } else {
          this.serverError = `<i class="bi bi-exclamation-circle"></i> ${response.message}`;
          this.serverSuccess = null;
        }

      }
    });

  }

}
