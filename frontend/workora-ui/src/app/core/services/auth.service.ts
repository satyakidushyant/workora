import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AUTH_REPOSITORY, IAuthRepository } from '../../domain/repositories/i-auth.repository';
import {
  UserProfile,
  AuthTokens,
  LoginCredentials,
  ForgotPasswordParams,
  ResetPasswordParams,
  ChangePasswordParams,
  OperationResult
} from '../../domain/models/auth.model';
import { TokenService } from './token.service';
import { NotificationService } from './notification.service';

/**
 * High-level authentication facade service managing application user state, permissions, and session actions.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authRepository: IAuthRepository = inject(AUTH_REPOSITORY) as IAuthRepository;
  private readonly tokenService: TokenService = inject(TokenService) as TokenService;
  private readonly notificationService: NotificationService = inject(NotificationService) as NotificationService;
  private readonly router: Router = inject(Router) as Router;

  /**
   * Signal holding the currently authenticated user profile details.
   */
  readonly currentUser = signal<UserProfile | null>(null);

  /**
   * Signal indicating if a user is currently authenticated.
   */
  readonly isAuthenticated = computed<boolean>(() => {
    return !!this.currentUser() || this.tokenService.hasAccessToken();
  });

  /**
   * Signal exposing current user permission keys.
   */
  readonly userPermissions = computed<string[]>(() => {
    return this.currentUser()?.permissions || [];
  });

  /**
   * Signal exposing current user role names.
   */
  readonly userRoles = computed<string[]>(() => {
    return this.currentUser()?.roles || [];
  });

  /**
   * Authenticates user with credentials, stores returned tokens, and loads user profile.
   *
   * @param credentials User email and password.
   * @returns Observable emitting authentication tokens.
   */
  login(credentials: LoginCredentials): Observable<AuthTokens> {
    return this.authRepository.login(credentials).pipe(
      tap((tokens: AuthTokens) => {
        this.tokenService.setAccessToken(tokens.accessToken);
        this.tokenService.setRefreshToken(tokens.refreshToken);
        this.loadProfile().subscribe();
      }),
      catchError((err: Error) => {
        this.notificationService.showError(err.message || 'Authentication failed.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Loads profile details of current authenticated user from backend.
   *
   * @returns Observable emitting user profile.
   */
  loadProfile(): Observable<UserProfile> {
    return this.authRepository.getMyProfile().pipe(
      tap((profile: UserProfile) => {
        this.currentUser.set(profile);
      }),
      catchError((err: Error) => {
        this.currentUser.set(null);
        return throwError(() => err);
      })
    );
  }

  /**
   * Refreshes JWT access token using stored refresh token.
   *
   * @returns Observable emitting updated authentication tokens.
   */
  refreshToken(): Observable<AuthTokens> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      this.clearSessionAndRedirect();
      return throwError(() => new Error('No refresh token available.'));
    }

    return this.authRepository.refreshToken(refreshToken).pipe(
      tap((tokens: AuthTokens) => {
        this.tokenService.setAccessToken(tokens.accessToken);
        this.tokenService.setRefreshToken(tokens.refreshToken);
      }),
      catchError((err: Error) => {
        this.clearSessionAndRedirect();
        return throwError(() => err);
      })
    );
  }

  /**
   * Logs out user, invalidates refresh token on server, and redirects to login page.
   *
   * @returns Observable emitting operation result.
   */
  logout(): Observable<OperationResult> {
    const refreshToken = this.tokenService.getRefreshToken();
    const logout$ = refreshToken
      ? this.authRepository.logout(refreshToken)
      : of({ message: 'Logged out locally.' });

    return logout$.pipe(
      tap(() => {
        this.clearSessionAndRedirect();
        this.notificationService.showInfo('Logged out successfully.');
      }),
      catchError((err: Error) => {
        this.clearSessionAndRedirect();
        return of({ message: 'Logged out.' });
      })
    );
  }

  /**
   * Revokes all active user sessions across devices.
   *
   * @returns Observable emitting operation result.
   */
  logoutAll(): Observable<OperationResult> {
    return this.authRepository.logoutAll().pipe(
      tap(() => {
        this.clearSessionAndRedirect();
        this.notificationService.showInfo('Logged out from all devices.');
      })
    );
  }

  /**
   * Checks if current authenticated user has a specific permission key.
   *
   * @param permission Required permission identifier (e.g., 'employees.create').
   * @returns True if user possesses permission, false otherwise.
   */
  hasPermission(permission: string): boolean {
    if (!permission) return true;
    return this.userPermissions().includes(permission);
  }

  /**
   * Checks if current user has assigned role.
   *
   * @param role Role name string.
   * @returns True if assigned, false otherwise.
   */
  hasRole(role: string): boolean {
    if (!role) return true;
    return this.userRoles().includes(role);
  }

  /**
   * Dispatches forgot password email request.
   *
   * @param params Account email parameter.
   * @returns Observable emitting operation result summary.
   */
  forgotPassword(params: ForgotPasswordParams): Observable<OperationResult> {
    return this.authRepository.forgotPassword(params).pipe(
      tap((res: OperationResult) => {
        this.notificationService.showSuccess(res.message || 'Recovery link dispatched to your corporate email.');
      }),
      catchError((err: Error) => {
        this.notificationService.showError(err.message || 'Password recovery request failed.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Resets password using reset token and new password credentials.
   *
   * @param params Reset token and new password credentials.
   * @returns Observable emitting operation result summary.
   */
  resetPassword(params: ResetPasswordParams): Observable<OperationResult> {
    return this.authRepository.resetPassword(params).pipe(
      tap((res: OperationResult) => {
        this.notificationService.showSuccess(res.message || 'Password reset completed successfully.');
      }),
      catchError((err: Error) => {
        this.notificationService.showError(err.message || 'Password reset failed.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Updates password for authenticated active user.
   *
   * @param params Current password and new password credentials.
   * @returns Observable emitting operation result summary.
   */
  changePassword(params: ChangePasswordParams): Observable<OperationResult> {
    return this.authRepository.changePassword(params).pipe(
      tap((res: OperationResult) => {
        this.notificationService.showSuccess(res.message || 'Password changed successfully.');
      }),
      catchError((err: Error) => {
        this.notificationService.showError(err.message || 'Failed to update password.');
        return throwError(() => err);
      })
    );
  }

  /**
   * Clears local user state and token storage, navigating user to `/login`.
   */
  clearSessionAndRedirect(): void {
    this.tokenService.clearTokens();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}

