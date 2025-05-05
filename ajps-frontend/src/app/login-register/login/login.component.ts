import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginRegisterService } from '../../site-settings/auth/login-register.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(
    private loginRegisterService: LoginRegisterService

  ) {}

  onSubmit() {
    this.loginRegisterService.login({email: this.email, password: this.password}).subscribe({
      next: (response) => {
        
        // Reset the form by clearing the user object
        this.email = '';
        this.password = '';

        console.log('Login successful:', response);
        alert('Login successful! Please log in.');

        window.location.href="/user";

      },
      error: (error: Error) => {
        console.error('Login error:', error.message);
        alert(error.message);
      }
    });

  }

}
