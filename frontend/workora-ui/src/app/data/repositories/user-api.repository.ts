import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IUserRepository } from '../../domain/repositories/i-user.repository';
import {
  UserSummary,
  UserDetail,
  UserQueryParams,
  CreateUserParams,
  UpdateUserParams,
  AssignRolesParams,
  AdminResetPasswordParams
} from '../../domain/models/user.model';
import { ApiResponse, PagedResponse } from '../../domain/models/api-response.model';
import {
  UserDto,
  UserDetailDto,
  CreateUserRequestDto,
  UpdateUserRequestDto,
  AssignRolesRequestDto,
  AdminResetPasswordRequestDto
} from '../dtos/user.dto';
import { UserMapper } from '../mappers/user.mapper';
import { environment } from '../../../environments/environment';

/**
 * Concrete implementation of IUserRepository executing HTTP API requests to the Workora backend.
 */
@Injectable({
  providedIn: 'root'
})
export class UserApiRepository implements IUserRepository {
  private readonly baseUrl = `${environment.apiUrl}/users`;

  /**
   * Initializes a new instance of the UserApiRepository class.
   *
   * @param http Angular HttpClient instance.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Fetches paginated user summaries with optional search and active status filters.
   */
  getUsers(params?: UserQueryParams): Observable<PagedResponse<UserSummary>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);
      if (params.companyId) httpParams = httpParams.set('companyId', params.companyId.toString());
      if (params.isActive !== undefined && params.isActive !== null) {
        httpParams = httpParams.set('isActive', params.isActive.toString());
      }
    }

    return this.http.get<ApiResponse<PagedResponse<UserDto>>>(this.baseUrl, { params: httpParams }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch users list.');
        }

        const pagedData = response.data;
        return {
          items: (pagedData.items || []).map(dto => UserMapper.fromUserDto(dto)),
          totalPages: pagedData.totalPages || 1,
          totalCount: pagedData.totalCount || 0,
          pageIndex: pagedData.pageIndex || (params?.pageNumber || 1),
          pageSize: pagedData.pageSize || (params?.pageSize || 10),
          hasPreviousPage: pagedData.hasPreviousPage || false,
          hasNextPage: pagedData.hasNextPage || false
        };
      })
    );
  }

  /**
   * Fetches user profile detail by ID.
   */
  getUserById(id: number): Observable<UserDetail> {
    return this.http.get<ApiResponse<UserDetailDto>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch user #${id}.`);
        }
        return UserMapper.fromUserDetailDto(response.data);
      })
    );
  }

  /**
   * Fetches caller's own account record.
   */
  getMyAccount(): Observable<UserDetail> {
    return this.http.get<ApiResponse<UserDetailDto>>(`${this.baseUrl}/me`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch account profile.');
        }
        return UserMapper.fromUserDetailDto(response.data);
      })
    );
  }

  /**
   * Creates a new system user.
   */
  createUser(params: CreateUserParams): Observable<UserSummary> {
    const payload: CreateUserRequestDto = {
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      password: params.password,
      employeeId: params.employeeId ?? null,
      roleId: params.roleId ?? null
    };


    return this.http.post<ApiResponse<UserDto>>(this.baseUrl, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create user account.');
        }
        return UserMapper.fromUserDto(response.data);
      })
    );
  }

  /**
   * Updates an existing user's profile.
   */
  updateUser(params: UpdateUserParams): Observable<UserSummary> {
    const payload: UpdateUserRequestDto = {
      firstName: params.firstName,
      lastName: params.lastName,
      employeeId: params.employeeId
    };

    return this.http.put<ApiResponse<UserDto>>(`${this.baseUrl}/${params.id}`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update user profile.');
        }
        return UserMapper.fromUserDto(response.data);
      })
    );
  }

  /**
   * Deactivates a user account.
   */
  deactivateUser(id: number): Observable<boolean> {
    return this.http.patch<ApiResponse<boolean>>(`${this.baseUrl}/${id}/deactivate`, {}).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to deactivate user.');
        }
        return response.data ?? true;
      })
    );
  }

  /**
   * Reactivates a user account.
   */
  activateUser(id: number): Observable<boolean> {
    return this.http.patch<ApiResponse<boolean>>(`${this.baseUrl}/${id}/activate`, {}).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to activate user.');
        }
        return response.data ?? true;
      })
    );
  }

  /**
   * Assigns role IDs to a user.
   */
  assignRoles(params: AssignRolesParams): Observable<boolean> {
    const payload: AssignRolesRequestDto = { roleIds: params.roleIds };
    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/${params.userId}/roles`, payload).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to assign roles.');
        }
        return response.data ?? true;
      })
    );
  }

  /**
   * Hard-deletes a user.
   */
  deleteUser(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to delete user.');
        }
        return response.data ?? true;
      })
    );
  }

  /**
   * Triggers an administrator password reset.
   */
  adminResetPassword(params: AdminResetPasswordParams): Observable<boolean> {
    const payload: AdminResetPasswordRequestDto = { newPassword: params.newPassword };
    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/${params.userId}/reset-password`, payload).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to reset user password.');
        }
        return response.data ?? true;
      })
    );
  }
}
