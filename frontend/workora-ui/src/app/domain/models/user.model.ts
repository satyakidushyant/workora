/**
/**
 * Domain model representing a summary user account for list views.
 */
export interface UserSummary {
  id: number;
  uuid: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  employeeId?: number | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * Domain model representing detailed user account information.
 */
export interface UserDetail extends UserSummary {
  failedLoginAttempts: number;
  lockoutEnd?: string | null;
  isLockedOut: boolean;
  roles: string[];
}

/**
 * Query parameter filters for retrieving paginated user lists.
 */
export interface UserQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  isActive?: boolean | null;
}

/**
 * Parameter payload for creating a new user account.
 */
export interface CreateUserParams {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  employeeId?: number | null;
}

/**
 * Parameter payload for updating an existing user account profile.
 */
export interface UpdateUserParams {
  id: number;
  firstName: string;
  lastName: string;
  employeeId?: number | null;
}

/**
 * Parameter payload for assigning roles to a user.
 */
export interface AssignRolesParams {
  userId: number;
  roleIds: number[];
}

/**
 * Parameter payload for an administrator resetting a user's password.
 */
export interface AdminResetPasswordParams {
  userId: number;
  newPassword: string;
}
