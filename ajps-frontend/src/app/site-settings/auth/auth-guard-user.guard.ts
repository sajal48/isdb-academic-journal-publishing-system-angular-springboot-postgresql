import { CanActivateFn } from '@angular/router';
import { AuthLoginRegisterService } from './auth-login-register.service';
import { inject } from '@angular/core';

export const authGuardUserGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthLoginRegisterService);

  const isLoggedIn = authService.isAuthenticated();
  const expectedRoles = route.data['roles'] as Array<string>;
  const userRole = authService.getUserRole().toLowerCase();

  if (isLoggedIn && expectedRoles == undefined) {
    return false;

  } else if (isLoggedIn && expectedRoles.includes(userRole)) {
    return true;
  }

  authService.logout();
  window.location.href="/login";
  return false;
};
