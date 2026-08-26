/**
 * Domain model representing a system permission item.
 */
export interface Permission {
  id: number;
  code: string;
  name: string;
  module: string;
  description?: string | null;
}

/**
 * Domain model representing permissions grouped by parent module.
 */
export interface ModulePermissions {
  module: string;
  permissions: Permission[];
}

/**
 * Domain model representing a role summary.
 */
export interface Role {
  id: number;
  name: string;
  description?: string | null;
  isSystemRole: boolean;
  userCount: number;
  permissionCount: number;
  createdAt: string;
}

/**
 * Domain model representing full role details including assigned permissions.
 */
export interface RoleDetail extends Role {
  permissions: Permission[];
}

/**
 * Query parameters for fetching paginated roles.
 */
export interface RoleQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
}

/**
 * Parameters for creating a role.
 */
export interface CreateRoleParams {
  name: string;
  description?: string | null;
  permissionIds?: number[];
}

/**
 * Parameters for updating a role.
 */
export interface UpdateRoleParams {
  id: number;
  name: string;
  description?: string | null;
}

/**
 * Parameters for setting a role's permissions.
 */
export interface SetRolePermissionsParams {
  roleId: number;
  permissionIds: number[];
}

/**
 * Parameters for cloning an existing role.
 */
export interface CloneRoleParams {
  sourceRoleId: number;
  newName: string;
  description?: string | null;
}
