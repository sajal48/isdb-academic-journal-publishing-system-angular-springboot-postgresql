import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthLoginRegisterService } from '../../site-settings/auth/auth-login-register.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recovery',
  imports: [RouterLink],
  templateUrl: './recovery.component.html',
  styleUrl: './recovery.component.css'
})
export class RecoveryComponent implements OnInit {

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

}
