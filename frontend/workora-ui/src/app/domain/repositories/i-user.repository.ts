import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import {
  UserSummary,
  UserDetail,
  UserQueryParams,
  CreateUserParams,
  UpdateUserParams,
  AssignRolesParams,
  AdminResetPasswordParams
} from '../models/user.model';
import { PagedResponse } from '../models/api-response.model';
import { OperationResult } from '../models/auth.model';

/**
 * Injection token for binding concrete IUserRepository implementations in DI.
 */
export const USER_REPOSITORY = new InjectionToken<IUserRepository>('IUserRepository');

/**
 * Abstract repository interface defining Users Module contract for Workora API.
 */
export interface IUserRepository {
  /**
   * Fetches a paginated list of users with optional filtering.
   *
   * @param params Query parameters for pagination and filtering.
   * @returns Observable emitting paginated user summaries.
   */
  getUsers(params?: UserQueryParams): Observable<PagedResponse<UserSummary>>;

  /**
   * Fetches detailed profile information for a single user by ID.
   *
   * @param id User identifier.
   * @returns Observable emitting UserDetail domain model.
   */
  getUserById(id: number): Observable<UserDetail>;

  /**
   * Fetches the current authenticated user's account profile.
   *
   * @returns Observable emitting UserDetail domain model.
   */
  getMyAccount(): Observable<UserDetail>;

  /**
   * Creates a new system user account.
   *
   * @param params Account creation parameters.
   * @returns Observable emitting newly created UserSummary.
   */
  createUser(params: CreateUserParams): Observable<UserSummary>;

  /**
   * Updates an existing user's profile details.
   *
   * @param params Profile update parameters.
   * @returns Observable emitting updated UserSummary.
   */
  updateUser(params: UpdateUserParams): Observable<UserSummary>;

  /**
   * Deactivates a user account.
   *
   * @param id User identifier.
   * @returns Observable emitting operation result confirmation.
   */
  deactivateUser(id: number): Observable<boolean>;

  /**
   * Reactivates a previously deactivated user account.
   *
   * @param id User identifier.
   * @returns Observable emitting operation result confirmation.
   */
  activateUser(id: number): Observable<boolean>;

  /**
   * Assigns roles to a user account.
   *
   * @param params Role assignment parameters.
   * @returns Observable emitting operation result confirmation.
   */
  assignRoles(params: AssignRolesParams): Observable<boolean>;

  /**
   * Hard-deletes a user account.
   *
   * @param id User identifier.
   * @returns Observable emitting operation result confirmation.
   */
  deleteUser(id: number): Observable<boolean>;

  /**
   * Triggers an admin password reset for a user account.
   *
   * @param params Admin reset password parameters.
   * @returns Observable emitting operation result confirmation.
   */
  adminResetPassword(params: AdminResetPasswordParams): Observable<boolean>;
}
