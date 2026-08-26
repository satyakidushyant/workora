import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

/**
 * Functional Guard verifying user authentication status before routing.
 */
export const authGuard: CanActivateFn & CanMatchFn = (
  route: ActivatedRouteSnapshot | Route,
  state?: RouterStateSnapshot | UrlSegment[]
) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router) as Router;

  if (tokenService.hasAccessToken()) {
    if (!authService.currentUser()) {
      return authService.loadProfile().pipe(
        map(() => true),
        catchError(() => {
          authService.clearSessionAndRedirect();
          return of(false);
        })
      );
    }
    return true;
  }

  // Redirect unauthenticated user to login screen
  return router.createUrlTree(['/login']);
};
