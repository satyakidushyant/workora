import { inject } from '@angular/core';
import { CanMatchFn, Route, UrlSegment, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

/**
 * Functional Guard checking role-based permission requirements specified on route data.
 */
export const rbacGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const authService = inject(AuthService) as AuthService;
  const notificationService = inject(NotificationService) as NotificationService;
  const router = inject(Router) as Router;

  const requiredPermission = route.data?.['requiredPermission'] as string | undefined;
  const requiredRole = route.data?.['requiredRole'] as string | undefined;

  if (requiredPermission && !authService.hasPermission(requiredPermission)) {
    notificationService.showError(`Access denied. Missing permission: ${requiredPermission}`);
    return router.createUrlTree(['/unauthorized']);
  }

  if (requiredRole && !authService.hasRole(requiredRole)) {
    notificationService.showError(`Access denied. Missing role: ${requiredRole}`);
    return router.createUrlTree(['/unauthorized']);
  }

  return true;
};
