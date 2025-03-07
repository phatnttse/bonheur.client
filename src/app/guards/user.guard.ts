import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { Role } from '../models/enums.model';

export const userGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const currentUser = authService.currentUser;
  if (currentUser && currentUser.roles.includes(Role.USER)) {
    return true;
  } else {
    router.navigate(['/authentication/signin']);
    return false;
  }
};
