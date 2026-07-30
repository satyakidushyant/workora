import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { rbacGuard } from './core/guards/rbac.guard';

/**
 * Main application routing configuration enforcing lazy loading and RBAC guards.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./presentation/features/landing/pages/landing-page.component').then(m => m.LandingPageComponent),
    pathMatch: 'full'
  },
  {
    path: 'landing',
    loadComponent: () => import('./presentation/features/landing/pages/landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./presentation/features/auth/pages/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./presentation/features/auth/pages/forgot-password-page.component').then(m => m.ForgotPasswordPageComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./presentation/features/auth/pages/reset-password-page.component').then(m => m.ResetPasswordPageComponent)
  },
  {
    path: 'change-password',
    loadComponent: () => import('./presentation/features/auth/pages/change-password-page.component').then(m => m.ChangePasswordPageComponent),
    canMatch: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./presentation/features/dashboard/pages/dashboard-page.component').then(m => m.DashboardPageComponent),
    canMatch: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

