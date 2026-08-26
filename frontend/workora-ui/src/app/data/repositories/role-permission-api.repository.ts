import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IRolePermissionRepository } from '../../domain/repositories/i-role-permission.repository';
import {
  Role,
  RoleDetail,
  RoleQueryParams,
  CreateRoleParams,
  UpdateRoleParams,
  SetRolePermissionsParams,
  CloneRoleParams,
  ModulePermissions
} from '../../domain/models/role-permission.model';
import { ApiResponse, PagedResponse } from '../../domain/models/api-response.model';
import {
  RoleDto,
  RoleDetailDto,
  CreateRoleRequestDto,
  UpdateRoleRequestDto,
  SetRolePermissionsRequestDto,
  CloneRoleRequestDto,
  ModulePermissionsDto
} from '../dtos/role-permission.dto';
import { RolePermissionMapper } from '../mappers/role-permission.mapper';
import { environment } from '../../../environments/environment';

/**
 * Concrete implementation of IRolePermissionRepository executing HTTP API requests against Workora backend.
 */
@Injectable({
  providedIn: 'root'
})
export class RolePermissionApiRepository implements IRolePermissionRepository {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  // ==========================================
  // Role Endpoints
  // ==========================================

  getRoles(params?: RoleQueryParams): Observable<PagedResponse<Role>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);
    }

    return this.http.get<ApiResponse<PagedResponse<RoleDto>>>(`${this.baseUrl}/roles`, { params: httpParams }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch roles list.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(r => RolePermissionMapper.fromRoleDto(r)),
          totalPages: paged.totalPages || 1,
          totalCount: paged.totalCount || 0,
          pageIndex: paged.pageIndex || (params?.pageNumber || 1),
          pageSize: paged.pageSize || (params?.pageSize || 10),
          hasPreviousPage: paged.hasPreviousPage || false,
          hasNextPage: paged.hasNextPage || false
        };
      })
    );
  }

  getRoleById(id: number): Observable<RoleDetail> {
    return this.http.get<ApiResponse<RoleDetailDto>>(`${this.baseUrl}/roles/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch role #${id}.`);
        }
        return RolePermissionMapper.fromRoleDetailDto(response.data);
      })
    );
  }

  createRole(params: CreateRoleParams): Observable<Role> {
    const payload: CreateRoleRequestDto = {
      name: params.name,
      description: params.description,
      permissionIds: params.permissionIds
    };

    return this.http.post<ApiResponse<RoleDto>>(`${this.baseUrl}/roles`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create role.');
        }
        return RolePermissionMapper.fromRoleDto(response.data);
      })
    );
  }

  updateRole(params: UpdateRoleParams): Observable<Role> {
    const payload: UpdateRoleRequestDto = {
      name: params.name,
      description: params.description
    };

    return this.http.put<ApiResponse<RoleDto>>(`${this.baseUrl}/roles/${params.id}`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update role.');
        }
        return RolePermissionMapper.fromRoleDto(response.data);
      })
    );
  }

  deleteRole(id: number): Observable<boolean> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/roles/${id}`).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to delete role.');
        }
        return response.data ?? true;
      })
    );
  }

  setRolePermissions(params: SetRolePermissionsParams): Observable<boolean> {
    const payload: SetRolePermissionsRequestDto = {
      permissionIds: params.permissionIds
    };

    return this.http.put<ApiResponse<boolean>>(`${this.baseUrl}/roles/${params.roleId}/permissions`, payload).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to update role permissions.');
        }
        return response.data ?? true;
      })
    );
  }

  cloneRole(params: CloneRoleParams): Observable<Role> {
    const payload: CloneRoleRequestDto = {
      newName: params.newName,
      description: params.description
    };

    return this.http.post<ApiResponse<RoleDto>>(`${this.baseUrl}/roles/${params.sourceRoleId}/clone`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to clone role.');
        }
        return RolePermissionMapper.fromRoleDto(response.data);
      })
    );
  }

  // ==========================================
  // Permission Catalog Endpoints
  // ==========================================

  getPermissions(): Observable<ModulePermissions[]> {
    return this.http.get<ApiResponse<ModulePermissionsDto[]>>(`${this.baseUrl}/permissions`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch permissions catalog.');
        }
        return response.data.map(mp => RolePermissionMapper.fromModulePermissionsDto(mp));
      })
    );
  }
}
