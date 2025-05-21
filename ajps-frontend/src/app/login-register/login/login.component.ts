import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthLoginRegisterService } from '../../site-settings/auth/auth-login-register.service';
import { CommonModule } from '@angular/common';
import { AuthRegisterLoginRequest } from '../../site-settings/interface/auth-register-login-request';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  user: AuthRegisterLoginRequest = {
    email: '',
    password: ''
  }

  serverError: SafeHtml | null = null;
  serverSuccess: SafeHtml | null = null;

  constructor(
    private authLoginRegisterService: AuthLoginRegisterService

  ) {}

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
          window.location.href="/user";

        } else {
          this.serverError = `<i class="bi bi-exclamation-circle"></i> ${response.message}`;
          this.serverSuccess = null;
        }

      }
    });

  }

}
