import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import {
  AuthTokens,
  UserProfile,
  UserSession,
  LoginCredentials,
  ForgotPasswordParams,
  ResetPasswordParams,
  ChangePasswordParams,
  OperationResult
} from '../models/auth.model';

/**
 * Injection token for binding concrete IAuthRepository implementations in DI.
 */
export const AUTH_REPOSITORY = new InjectionToken<IAuthRepository>('IAuthRepository');

/**
 * Abstract repository interface defining authentication contracts for Workora API.
 */
export interface IAuthRepository {
  /**
   * Authenticates a user with email and password credentials.
   *
   * @param credentials User email and password.
   * @returns Observable emitting authentication tokens.
   */
  login(credentials: LoginCredentials): Observable<AuthTokens>;

  /**
   * Refreshes JWT access token using a valid refresh token.
   *
   * @param refreshToken Active refresh token string.
   * @returns Observable emitting updated authentication tokens.
   */
  refreshToken(refreshToken: string): Observable<AuthTokens>;

  /**
   * Logs out the current user by invalidating their current refresh token.
   *
   * @param refreshToken Refresh token to invalidate.
   * @returns Observable emitting operation result summary.
   */
  logout(refreshToken: string): Observable<OperationResult>;

  /**
   * Logs out the user from all active sessions and revokes all refresh tokens.
   *
   * @returns Observable emitting operation result summary.
   */
  logoutAll(): Observable<OperationResult>;

  /**
   * Fetches the current authenticated user profile.
   *
   * @returns Observable emitting user profile details.
   */
  getMyProfile(): Observable<UserProfile>;

  /**
   * Retrieves all active sessions/devices associated with the current user.
   *
   * @returns Observable emitting list of active user sessions.
   */
  listMySessions(): Observable<UserSession[]>;

  /**
   * Initiates forgot password flow by dispatching reset instructions.
   *
   * @param params Account email parameters.
   * @returns Observable emitting operation result summary.
   */
  forgotPassword(params: ForgotPasswordParams): Observable<OperationResult>;

  /**
   * Completes password reset flow using token and new password.
   *
   * @param params Reset token and new password credentials.
   * @returns Observable emitting operation result summary.
   */
  resetPassword(params: ResetPasswordParams): Observable<OperationResult>;

  /**
   * Changes current password for authenticated user.
   *
   * @param params Current password and new password credentials.
   * @returns Observable emitting operation result summary.
   */
  changePassword(params: ChangePasswordParams): Observable<OperationResult>;
}
