import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, Route, UrlSegment } from '@angular/router';
import { TokenService } from '../services/token.service';

/**
 * Functional Guard verifying user authentication status before routing.
 */
export const authGuard: CanActivateFn & CanMatchFn = (
  route: ActivatedRouteSnapshot | Route,
  state?: RouterStateSnapshot | UrlSegment[]
) => {
  const tokenService = inject(TokenService);
  const router = inject(Router) as Router;

  if (tokenService.hasAccessToken()) {
    return true;
  }

  // Redirect unauthenticated user to login screen
  return router.createUrlTree(['/login']);
};
