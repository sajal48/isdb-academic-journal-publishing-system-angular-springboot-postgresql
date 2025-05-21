import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthRegisterRequest } from '../../site-settings/interface/auth-register-request';
import { AuthLoginRegisterService } from '../../site-settings/auth/auth-login-register.service';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: AuthRegisterRequest = {
    email: '',
    password: ''
  }
  confirm_password: string = '';
  passwordMismatch: boolean = false;

  serverError: SafeHtml | null = null;
  serverSuccess: SafeHtml | null = null;

  constructor(
    private authLoginRegisterService: AuthLoginRegisterService

  ){}

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

        // console.log('Registration successful:', response);
      //   this.serverSuccess = '<i class="bi bi-check-circle"></i> Registration successful! Please log in.';
      //   this.serverError = null;

      //   this.user = { email: '', password: ''};
      //   this.confirm_password = '';

      // },
      // error: (error: any) => {
        // console.error('Registration error:', error);
        // alert(error.message);
        // this.serverError = error?.error?.message || '<i class="bi bi-exclamation-circle"></i> Something went wrong. Please try again.';
        // this.serverSuccess = null;


        if (response.code === 200) {
        this.serverSuccess = `<i class="bi bi-check-circle"></i> ${response.message}`;
        this.serverError = null;

        // Clear form
        this.user = { email: '', password: '' };
        this.confirm_password = '';

      } else {
        this.serverError = `<i class="bi bi-exclamation-circle"></i> ${response.message}`;
        this.serverSuccess = null;
      }


      }
    }

  );
  }

}
