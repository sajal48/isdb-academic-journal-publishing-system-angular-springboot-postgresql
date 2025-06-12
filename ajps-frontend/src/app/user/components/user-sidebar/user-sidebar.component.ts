import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthLoginRegisterService } from '../../../site-settings/auth/auth-login-register.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './user-sidebar.component.html',
  styleUrl: './user-sidebar.component.css'
})
export class UserSidebarComponent implements OnInit {
  userRole: string | null = null;

  constructor(
    private authLoginRegisterService: AuthLoginRegisterService

  ) {}

  ngOnInit(): void {
    this.userRole = this.authLoginRegisterService.getUserRole();
  }

}
