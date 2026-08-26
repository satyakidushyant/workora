import {
  RoleDto,
  RoleDetailDto,
  PermissionDto,
  ModulePermissionsDto
} from '../dtos/role-permission.dto';
import {
  Role,
  RoleDetail,
  Permission,
  ModulePermissions
} from '../../domain/models/role-permission.model';

/**
 * Pure mapper transforming between Role/Permission DTOs and Domain Models.
 */
export class RolePermissionMapper {
  /**
   * Maps PermissionDto to Permission domain model.
   */
  static fromPermissionDto(dto: PermissionDto): Permission {
    return {
      id: dto.id,
      code: dto.code,
      name: dto.name,
      module: dto.module,
      description: dto.description
    };
  }

  /**
   * Maps ModulePermissionsDto to ModulePermissions domain model.
   */
  static fromModulePermissionsDto(dto: ModulePermissionsDto): ModulePermissions {
    return {
      module: dto.module,
      permissions: (dto.permissions || []).map(p => this.fromPermissionDto(p))
    };
  }

  /**
   * Maps RoleDto to Role domain model.
   */
  static fromRoleDto(dto: RoleDto): Role {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      isSystemRole: dto.isSystemRole,
      userCount: dto.userCount,
      permissionCount: dto.permissionCount,
      createdAt: dto.createdAt
    };
  }

  /**
   * Maps RoleDetailDto to RoleDetail domain model.
   */
  static fromRoleDetailDto(dto: RoleDetailDto): RoleDetail {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      isSystemRole: dto.isSystemRole,
      userCount: dto.userCount,
      permissionCount: dto.permissionCount,
      createdAt: dto.createdAt,
      permissions: (dto.permissions || []).map(p => this.fromPermissionDto(p))
    };
  }
}
