import { inject } from '@angular/core';
import {
  CanActivateFn,
  CanMatchFn,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { NotificationService } from '../services/notification.service';
import { UserProfile } from '../../domain/models/auth.model';

/**
 * Functional Guard checking role-based permission requirements specified on route data.
 * Supports both CanActivate and CanMatch lifecycle steps, and asynchronous profile fetching on page refresh (F5).
 *
 * Route data options:
 * - `requiredPermission: string` — user must have this exact permission
 * - `requiredPermissions: string[]` — user must have ANY ONE of these permissions (OR logic)
 * - `requiredRole: string` — user must have this exact role
 * - `requiredRoles: string[]` — user must have ANY ONE of these roles (OR logic)
 *
 * SuperAdmin role automatically passes all permission checks.
 */
export const rbacGuard: CanActivateFn & CanMatchFn = (
  route: ActivatedRouteSnapshot | Route,
  stateOrSegments?: RouterStateSnapshot | UrlSegment[]
) => {
  const authService = inject(AuthService) as AuthService;
  const tokenService = inject(TokenService) as TokenService;
  const notificationService = inject(NotificationService) as NotificationService;
  const router = inject(Router) as Router;

  const data = route.data;
  const requiredPermission = data?.['requiredPermission'] as string | undefined;
  const requiredPermissions = data?.['requiredPermissions'] as string[] | undefined;
  const requiredRole = data?.['requiredRole'] as string | undefined;
  const requiredRoles = data?.['requiredRoles'] as string[] | undefined;

  // If no token exists, redirect to login
  if (!tokenService.hasAccessToken()) {
    return router.createUrlTree(['/login']);
  }

  // If token exists but user profile signal is not populated (e.g. page refresh F5)
  if (!authService.currentUser()) {
    return authService.loadProfile().pipe(
      map(profile => checkPermissions(profile, requiredPermission, requiredPermissions, requiredRole, requiredRoles, notificationService, router)),
      catchError(() => {
        authService.clearSessionAndRedirect();
        return of(false);
      })
    );
  }

  return checkPermissions(authService.currentUser(), requiredPermission, requiredPermissions, requiredRole, requiredRoles, notificationService, router);
};

/**
 * Checks whether the user profile satisfies the route's permission and role requirements.
 * SuperAdmin role bypasses all permission checks (matching AuthService.hasPermission behavior).
 */
function checkPermissions(
  profile: UserProfile | null,
  requiredPermission: string | undefined,
  requiredPermissions: string[] | undefined,
  requiredRole: string | undefined,
  requiredRoles: string[] | undefined,
  notificationService: NotificationService,
  router: Router
): boolean | UrlTree {
  if (!profile) {
    return router.createUrlTree(['/login']);
  }

  // SuperAdmin bypasses all permission checks (they have all permissions from backend)
  const isSuperAdmin = profile.roles?.includes('SuperAdmin') ?? false;

  // Check single required permission
  if (requiredPermission && !isSuperAdmin) {
    if (!profile.permissions || !profile.permissions.includes(requiredPermission)) {
      notificationService.showError(`Access denied. You don't have the required permission.`);
      return router.createUrlTree(['/dashboard']);
    }
  }

  // Check multiple required permissions (OR logic — user needs ANY one)
  if (requiredPermissions && requiredPermissions.length > 0 && !isSuperAdmin) {
    const userPerms = profile.permissions || [];
    const hasAny = requiredPermissions.some(p => userPerms.includes(p));
    if (!hasAny) {
      notificationService.showError(`Access denied. You don't have the required permission.`);
      return router.createUrlTree(['/dashboard']);
    }
  }

  // Check single required role
  if (requiredRole) {
    if (!profile.roles || !profile.roles.includes(requiredRole)) {
      notificationService.showError(`Access denied. You don't have the required role.`);
      return router.createUrlTree(['/dashboard']);
    }
  }

  // Check multiple required roles (OR logic — user needs ANY one)
  if (requiredRoles && requiredRoles.length > 0) {
    const userR = profile.roles || [];
    const hasAnyRole = requiredRoles.some(r => userR.includes(r));
    if (!hasAnyRole) {
      notificationService.showError(`Access denied. You don't have the required role.`);
      return router.createUrlTree(['/dashboard']);
    }
  }

  return true;
}
