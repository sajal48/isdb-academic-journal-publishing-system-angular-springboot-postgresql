import { CanActivateFn } from '@angular/router';
import { AuthLoginRegisterService } from './auth-login-register.service';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';

export const authGuardUserGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthLoginRegisterService);
  const expectedRoles = route.data['roles'] as Array<string>;

  return authService.isAuthenticated().pipe(
    map((isValid) => {
      if (!isValid) {
        authService.logout();
        return false;
      }

      const userRole = authService.getUserRole().toLowerCase();

      if (!expectedRoles || expectedRoles.length === 0) {
        return false; // allow if no role restrictions
      }

      if (expectedRoles.includes(userRole)) {
        return true;
      }

      authService.logout();
      return false;
    }),
    catchError(() => {
      authService.logout();
      return of(false);
    })
  );
};
