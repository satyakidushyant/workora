/**
 * DTO matching backend `AuthResultDto`.
 */
export interface AuthResultDto {
  /**
   * JWT access token string.
   */
  accessToken: string;

  /**
   * Refresh token string.
   */
  refreshToken: string;

  /**
   * Access token lifetime in seconds.
   */
  expiresIn: number;
}

/**
 * DTO matching backend `UserProfileDto`.
 */
export interface UserProfileDto {
  /**
   * Unique user GUID.
   */
  id: string;

  /**
   * User email address.
   */
  email: string;

  /**
   * User first name.
   */
  firstName: string;

  /**
   * User last name.
   */
  lastName: string;

  /**
   * Linked employee ID if present.
   */
  employeeId?: number | null;

  /**
   * User role names list.
   */
  roles: string[];

  /**
   * User permission identifiers list.
   */
  permissions: string[];

  /**
   * Integer user account ID.
   */
  userId?: number | null;

  /**
   * Tenant UUID context.
   */
  tenantId?: string | null;

  /**
   * Company ID context.
   */
  companyId?: number | null;

  /**
   * Company display name.
   */
  companyName?: string | null;

  /**
   * Company short code.
   */
  companyCode?: string | null;

  /**
   * Employee alphanumeric code.
   */
  employeeCode?: string | null;

  /**
   * Department name.
   */
  departmentName?: string | null;

  /**
   * Designation / Job title.
   */
  designationTitle?: string | null;
}

/**
 * DTO matching backend `UserSessionDto`.
 */
export interface UserSessionDto {
  /**
   * Unique session GUID.
   */
  id: string;

  /**
   * IP address of session creation.
   */
  createdByIp: string;

  /**
   * User agent header string.
   */
  createdByUserAgent: string;

  /**
   * Expiration ISO date string.
   */
  expiresAt: string;
}

/**
 * DTO for `POST /api/v1/auth/login`.
 */
export interface LoginRequestDto {
  /**
   * Account email.
   */
  email: string;

  /**
   * Account password.
   */
  password: string;
}

/**
 * DTO for `POST /api/v1/auth/refresh-token`.
 */
export interface RefreshTokenRequestDto {
  /**
   * Refresh token string.
   */
  refreshToken: string;
}

/**
 * DTO for `POST /api/v1/auth/logout`.
 */
export interface LogoutRequestDto {
  /**
   * Refresh token string to invalidate.
   */
  refreshToken: string;
}

/**
 * DTO for `POST /api/v1/auth/forgot-password`.
 */
export interface ForgotPasswordRequestDto {
  /**
   * Account email address.
   */
  email: string;
}

/**
 * DTO for `POST /api/v1/auth/reset-password`.
 */
export interface ResetPasswordRequestDto {
  /**
   * Account email address.
   */
  email: string;

  /**
   * Password reset token.
   */
  token: string;

  /**
   * New password string.
   */
  newPassword: string;
}

/**
 * DTO for `POST /api/v1/auth/change-password`.
 */
export interface ChangePasswordRequestDto {
  /**
   * Current account password.
   */
  currentPassword: string;

  /**
   * New account password.
   */
  newPassword: string;
}

/**
 * Response DTO for logout action.
 */
export interface LogoutResponseDto {
  /**
   * Indicates if logout succeeded.
   */
  success: boolean;

  /**
   * Summary message.
   */
  message: string;
}

/**
 * Response DTO for forgot password action.
 */
export interface ForgotPasswordResponseDto {
  /**
   * Summary message.
   */
  message: string;
}

/**
 * Response DTO for reset password action.
 */
export interface ResetPasswordResponseDto {
  /**
   * Summary message.
   */
  message: string;
}

/**
 * Response DTO for change password action.
 */
export interface ChangePasswordResponseDto {
  /**
   * Summary message.
   */
  message: string;
}
