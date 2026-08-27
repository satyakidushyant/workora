/**
 * Data Transfer Object for user summary returned by API.
 */
export interface UserDto {
  id: number;
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  employeeId?: number | null;
  isActive: boolean;
  createdAt: string;
  roles?: string[];
}

/**
 * Data Transfer Object for detailed user information returned by API.
 */
export interface UserDetailDto extends UserDto {
  failedLoginAttempts: number;
  lockoutEnd?: string | null;
  isLockedOut: boolean;
  roles: string[];
}

/**
 * Payload DTO for creating a user account.
 */
export interface CreateUserRequestDto {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  employeeId?: number | null;
}

/**
 * Payload DTO for updating a user profile.
 */
export interface UpdateUserRequestDto {
  firstName: string;
  lastName: string;
  employeeId?: number | null;
}

/**
 * Payload DTO for assigning roles to a user.
 */
export interface AssignRolesRequestDto {
  roleIds: number[];
}

/**
 * Payload DTO for admin password reset.
 */
export interface AdminResetPasswordRequestDto {
  newPassword: string;
}
