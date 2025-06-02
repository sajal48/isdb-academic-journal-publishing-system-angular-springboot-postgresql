import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthRegisterLoginRequest } from '../../site-settings/interfaces/auth-register-login-request';
import { AuthLoginRegisterService } from '../../site-settings/auth/auth-login-register.service';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: AuthRegisterLoginRequest = {
    email: '',
    password: '',
    userRole: 'USER'
  }
  confirm_password: string = '';
  passwordMismatch: boolean = false;

  serverError: SafeHtml | null = null;
  serverSuccess: SafeHtml | null = null;

  constructor(
    private authLoginRegisterService: AuthLoginRegisterService,
    private router: Router

  ){}

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
    if (!this.user.email || !this.user.password || !this.confirm_password) {
      this.serverError = '<i class="bi bi-exclamation-circle"></i> All fields are required.';
      this.serverSuccess = null;
      return;
    }
    if (this.user.password !== this.confirm_password) {
      this.passwordMismatch = true;
      this.serverError = '<i class="bi bi-exclamation-circle"></i> Passwords do not match.';
      this.serverSuccess = null;
      return;
    }
    this.passwordMismatch = false;
    this.serverError = null;
    this.serverSuccess = null;

    this.authLoginRegisterService.register(this.user).subscribe({
      next: (response) => {

        if (response.code === 200) {
          this.serverSuccess = `<i class="bi bi-check-circle"></i> Registration successful. Please <a class="custom-link" href="/login">login</a>`;
          this.serverError = null;

          // clear form
          this.user = {email: '', password: '', userRole: ''};
          this.confirm_password = '';

        } else {
          this.serverError = `<i class="bi bi-exclamation-circle"></i> ${response.message}`;
          this.serverSuccess = null;
        }

      }
    });
  }

}
