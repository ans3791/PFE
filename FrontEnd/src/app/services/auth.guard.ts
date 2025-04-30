import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from './user.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const isAuthenticated = inject(UserService).isLogged;
  const router = inject(Router);
  if (!isAuthenticated) {
    router.navigate(['/home']);
    return false;
  } else {
    return true;
  }
};
