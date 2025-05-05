import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginRegisterService } from '../../site-settings/auth/login-register.service';
import { UserRegisterRequest } from '../../site-settings/interface/user-register-request';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: UserRegisterRequest = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'USER'
  }

  constructor(
    private loginRegisterService: LoginRegisterService

  ){}

  onSubmit() {
    this.loginRegisterService.register(this.user).subscribe({
      next: (response) => {
        
        // Reset the form by clearing the user object
        this.user = {firstName: '', lastName: '', email: '', password: '', phoneNumber: '', role: ''};

        console.log('Registration successful:', response);
        alert('Registration successful! Please log in.');

      },
      error: (error: Error) => {
        console.error('Registration error:', error.message);
        alert(error.message);
      }
    });
  }

}
