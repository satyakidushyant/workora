import { UserDto, UserDetailDto } from '../dtos/user.dto';
import { UserSummary, UserDetail } from '../../domain/models/user.model';

/**
 * Mapper for transforming User DTOs into Domain Models.
 */
export class UserMapper {
  /**
   * Maps a UserDto to a UserSummary domain model.
   *
   * @param dto Raw user DTO from API.
   * @returns Transformed UserSummary entity.
   */
  static fromUserDto(dto: UserDto): UserSummary {
    return {
      id: dto.id,
      uuid: dto.uuid,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      fullName: dto.fullName || `${dto.firstName} ${dto.lastName}`.trim(),
      employeeId: dto.employeeId ?? null,
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }

  /**
   * Maps a UserDetailDto to a UserDetail domain model.
   *
   * @param dto Raw user detail DTO from API.
   * @returns Transformed UserDetail entity.
   */
  static fromUserDetailDto(dto: UserDetailDto): UserDetail {
    return {
      ...UserMapper.fromUserDto(dto),
      failedLoginAttempts: dto.failedLoginAttempts ?? 0,
      lockoutEnd: dto.lockoutEnd ?? null,
      isLockedOut: dto.isLockedOut ?? false,
      roles: dto.roles || []
    };
  }
}
