/**
 * DTO representing a permission item.
 */
export interface PermissionDto {
  id: number;
  code: string;
  name: string;
  module: string;
  description?: string | null;
}

/**
 * DTO representing permissions grouped by module.
 */
export interface ModulePermissionsDto {
  module: string;
  permissions: PermissionDto[];
}

/**
 * DTO representing a role summary.
 */
export interface RoleDto {
  id: number;
  name: string;
  description?: string | null;
  isSystemRole: boolean;
  userCount: number;
  permissionCount: number;
  createdAt: string;
}

/**
 * DTO representing role details including assigned permissions.
 */
export interface RoleDetailDto extends RoleDto {
  permissions: PermissionDto[];
}

/**
 * Request payload for creating a role.
 */
export interface CreateRoleRequestDto {
  name: string;
  description?: string | null;
  permissionIds?: number[];
}

/**
 * Request payload for updating a role.
 */
export interface UpdateRoleRequestDto {
  name: string;
  description?: string | null;
}

/**
 * Request payload for setting role permissions.
 */
export interface SetRolePermissionsRequestDto {
  permissionIds: number[];
}

/**
 * Request payload for cloning a role.
 */
export interface CloneRoleRequestDto {
  newName: string;
  description?: string | null;
}
