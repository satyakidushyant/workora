/**
 * Represents authentication tokens returned upon successful login or token refresh.
 */
export interface AuthTokens {
  /**
   * JWT Access Token used for authorizing HTTP requests.
   */
  accessToken: string;

  /**
   * Refresh Token used to request a new JWT access token upon expiration.
   */
  refreshToken: string;

  /**
   * Lifetime of the access token in seconds.
   */
  expiresIn: number;
}

/**
 * Represents authenticated user profile details.
 */
export interface UserProfile {
  /**
   * Unique user identifier.
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
   * Linked internal employee ID, if applicable.
   */
  employeeId?: number | null;

  /**
   * List of assigned user roles.
   */
  roles: string[];

  /**
   * List of granular user permissions.
   */
  permissions: string[];
}

/**
 * Represents an active session or device associated with the authenticated user.
 */
export interface UserSession {
  /**
   * Unique session identifier (refresh token ID).
   */
  id: string;

  /**
   * IP address from which the session was established.
   */
  createdByIp: string;

  /**
   * User-Agent header string of the device/browser.
   */
  createdByUserAgent: string;

  /**
   * Expiration date and time of the session.
   */
  expiresAt: string;
}

/**
 * Parameters required for authenticating a user.
 */
export interface LoginCredentials {
  /**
   * User login email address.
   */
  email: string;

  /**
   * User password.
   */
  password: string;
}

/**
 * Parameters required to initiate password reset via email.
 */
export interface ForgotPasswordParams {
  /**
   * Email address associated with the account.
   */
  email: string;
}

/**
 * Parameters required to complete password reset with a token.
 */
export interface ResetPasswordParams {
  /**
   * Email address associated with the account.
   */
  email: string;

  /**
   * Password reset token received via email.
   */
  token: string;

  /**
   * New password to set for the account.
   */
  newPassword: string;
}

/**
 * Parameters required for an authenticated user to change password.
 */
export interface ChangePasswordParams {
  /**
   * Current password of the user.
   */
  currentPassword: string;

  /**
   * New password for the account.
   */
  newPassword: string;
}

/**
 * Common operational response outcome detail.
 */
export interface OperationResult {
  /**
   * Success message or summary of operation result.
   */
  message: string;
}
