import { Observable } from 'rxjs';
import { PagedResponse } from '../models/api-response.model';
import {
  Role,
  RoleDetail,
  RoleQueryParams,
  CreateRoleParams,
  UpdateRoleParams,
  SetRolePermissionsParams,
  CloneRoleParams,
  ModulePermissions
} from '../models/role-permission.model';

/**
 * Repository interface for role and permission operations.
 */
export interface IRolePermissionRepository {
  // Roles
  getRoles(params?: RoleQueryParams): Observable<PagedResponse<Role>>;
  getRoleById(id: number): Observable<RoleDetail>;
  createRole(params: CreateRoleParams): Observable<Role>;
  updateRole(params: UpdateRoleParams): Observable<Role>;
  deleteRole(id: number): Observable<boolean>;
  setRolePermissions(params: SetRolePermissionsParams): Observable<boolean>;
  cloneRole(params: CloneRoleParams): Observable<Role>;

  // Permissions
  getPermissions(): Observable<ModulePermissions[]>;
}
