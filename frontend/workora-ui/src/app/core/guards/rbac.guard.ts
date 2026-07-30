import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment, Router, UrlTree } from '@angular/router';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { NotificationService } from '../services/notification.service';
import { UserProfile } from '../../domain/models/auth.model';

/**
 * Functional Guard checking role-based permission requirements specified on route data,
 * supporting asynchronous profile fetching on page refresh (F5).
 */
export const rbacGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const authService = inject(AuthService) as AuthService;
  const tokenService = inject(TokenService) as TokenService;
  const notificationService = inject(NotificationService) as NotificationService;
  const router = inject(Router) as Router;

  const requiredPermission = route.data?.['requiredPermission'] as string | undefined;
  const requiredRole = route.data?.['requiredRole'] as string | undefined;

  // If no token exists, redirect to login
  if (!tokenService.hasAccessToken()) {
    return router.createUrlTree(['/login']);
  }

  // If token exists but user profile signal is not populated (e.g. page refresh F5)
  if (!authService.currentUser()) {
    return authService.loadProfile().pipe(
      map(profile => checkPermissions(profile, requiredPermission, requiredRole, notificationService, router)),
      catchError(() => {
        authService.clearSessionAndRedirect();
        return of(false);
      })
    );
  }

  return checkPermissions(authService.currentUser(), requiredPermission, requiredRole, notificationService, router);
};

function checkPermissions(
  profile: UserProfile | null,
  requiredPermission: string | undefined,
  requiredRole: string | undefined,
  notificationService: NotificationService,
  router: Router
): boolean | UrlTree {
  if (!profile) {
    return router.createUrlTree(['/login']);
  }

  if (requiredPermission && (!profile.permissions || !profile.permissions.includes(requiredPermission))) {
    notificationService.showError(`Access denied. Missing permission: ${requiredPermission}`);
    return router.createUrlTree(['/dashboard']);
  }

  if (requiredRole && (!profile.roles || !profile.roles.includes(requiredRole))) {
    notificationService.showError(`Access denied. Missing role: ${requiredRole}`);
    return router.createUrlTree(['/dashboard']);
  }

  return true;
}
