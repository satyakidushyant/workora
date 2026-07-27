import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAuthRepository } from '../../domain/repositories/i-auth.repository';
import {
  AuthTokens,
  UserProfile,
  UserSession,
  LoginCredentials,
  ForgotPasswordParams,
  ResetPasswordParams,
  ChangePasswordParams,
  OperationResult
} from '../../domain/models/auth.model';
import { ApiResponseDto } from '../dtos/api-response.dto';
import {
  AuthResultDto,
  UserProfileDto,
  UserSessionDto,
  LogoutResponseDto,
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
  ChangePasswordResponseDto,
  LoginRequestDto,
  RefreshTokenRequestDto,
  LogoutRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
  ChangePasswordRequestDto
} from '../dtos/auth.dto';
import { AuthMapper } from '../mappers/auth.mapper';
import { environment } from '../../../environments/environment';

/**
 * Concrete implementation of IAuthRepository executing HTTP API requests to the Workora backend.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthApiRepository implements IAuthRepository {
  /**
   * Base API endpoint URL.
   */
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  /**
   * Initializes a new instance of the AuthApiRepository class.
   *
   * @param http Angular HttpClient instance.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Authenticates user using email and password credentials.
   *
   * @param credentials Login credentials.
   * @returns Observable emitting domain AuthTokens.
   */
  login(credentials: LoginCredentials): Observable<AuthTokens> {
    const payload: LoginRequestDto = {
      email: credentials.email,
      password: credentials.password
    };

    return this.http.post<ApiResponseDto<AuthResultDto>>(`${this.baseUrl}/login`, payload).pipe(
      map((response: ApiResponseDto<AuthResultDto>) => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Login failed.');
        }
        return AuthMapper.fromAuthResultDto(response.data);
      })
    );
  }

  /**
   * Refreshes access token using refresh token.
   *
   * @param refreshToken Refresh token string.
   * @returns Observable emitting updated AuthTokens.
   */
  refreshToken(refreshToken: string): Observable<AuthTokens> {
    const payload: RefreshTokenRequestDto = { refreshToken };

    return this.http.post<ApiResponseDto<AuthResultDto>>(`${this.baseUrl}/refresh-token`, payload).pipe(
      map((response: ApiResponseDto<AuthResultDto>) => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Token refresh failed.');
        }
        return AuthMapper.fromAuthResultDto(response.data);
      })
    );
  }

  /**
   * Logs out current user session.
   *
   * @param refreshToken Refresh token string.
   * @returns Observable emitting OperationResult.
   */
  logout(refreshToken: string): Observable<OperationResult> {
    const payload: LogoutRequestDto = { refreshToken };

    return this.http.post<ApiResponseDto<LogoutResponseDto>>(`${this.baseUrl}/logout`, payload).pipe(
      map((response: ApiResponseDto<LogoutResponseDto>) => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Logout failed.');
        }
        return AuthMapper.toOperationResult(response.data);
      })
    );
  }

  /**
   * Logs out user from all active sessions.
   *
   * @returns Observable emitting OperationResult.
   */
  logoutAll(): Observable<OperationResult> {
    return this.http.post<ApiResponseDto<LogoutResponseDto>>(`${this.baseUrl}/logout-all`, {}).pipe(
      map((response: ApiResponseDto<LogoutResponseDto>) => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Logout all failed.');
        }
        return AuthMapper.toOperationResult(response.data);
      })
    );
  }

  /**
   * Fetches profile of current authenticated user.
   *
   * @returns Observable emitting UserProfile domain model.
   */
  getMyProfile(): Observable<UserProfile> {
    return this.http.get<ApiResponseDto<UserProfileDto>>(`${this.baseUrl}/me`).pipe(
      map((response: ApiResponseDto<UserProfileDto>) => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch user profile.');
        }
        return AuthMapper.fromUserProfileDto(response.data);
      })
    );
  }

  /**
   * Lists active sessions for current user.
   *
   * @returns Observable emitting array of UserSession domain models.
   */
  listMySessions(): Observable<UserSession[]> {
    return this.http.get<ApiResponseDto<UserSessionDto[]>>(`${this.baseUrl}/sessions`).pipe(
      map((response: ApiResponseDto<UserSessionDto[]>) => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to list active sessions.');
        }
        return AuthMapper.fromUserSessionDtoList(response.data);
      })
    );
  }

  /**
   * Dispatches forgot password request for email.
   *
   * @param params Account email parameter.
   * @returns Observable emitting OperationResult.
   */
  forgotPassword(params: ForgotPasswordParams): Observable<OperationResult> {
    const payload: ForgotPasswordRequestDto = { email: params.email };

    return this.http.post<ApiResponseDto<ForgotPasswordResponseDto>>(`${this.baseUrl}/forgot-password`, payload).pipe(
      map((response: ApiResponseDto<ForgotPasswordResponseDto>) => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Forgot password request failed.');
        }
        return AuthMapper.toOperationResult(response.data);
      })
    );
  }

  /**
   * Executes password reset with token and new password.
   *
   * @param params Reset token and new password credentials.
   * @returns Observable emitting OperationResult.
   */
  resetPassword(params: ResetPasswordParams): Observable<OperationResult> {
    const payload: ResetPasswordRequestDto = {
      email: params.email,
      token: params.token,
      newPassword: params.newPassword
    };

    return this.http.post<ApiResponseDto<ResetPasswordResponseDto>>(`${this.baseUrl}/reset-password`, payload).pipe(
      map((response: ApiResponseDto<ResetPasswordResponseDto>) => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Password reset failed.');
        }
        return AuthMapper.toOperationResult(response.data);
      })
    );
  }

  /**
   * Changes password for authenticated user.
   *
   * @param params Current password and new password credentials.
   * @returns Observable emitting OperationResult.
   */
  changePassword(params: ChangePasswordParams): Observable<OperationResult> {
    const payload: ChangePasswordRequestDto = {
      currentPassword: params.currentPassword,
      newPassword: params.newPassword
    };

    return this.http.post<ApiResponseDto<ChangePasswordResponseDto>>(`${this.baseUrl}/change-password`, payload).pipe(
      map((response: ApiResponseDto<ChangePasswordResponseDto>) => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Password change failed.');
        }
        return AuthMapper.toOperationResult(response.data);
      })
    );
  }
}
