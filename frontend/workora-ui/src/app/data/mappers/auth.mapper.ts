import {
  AuthTokens,
  UserProfile,
  UserSession,
  OperationResult
} from '../../domain/models/auth.model';
import {
  AuthResultDto,
  UserProfileDto,
  UserSessionDto,
  LogoutResponseDto,
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
  ChangePasswordResponseDto
} from '../dtos/auth.dto';

/**
 * Mapper utilities converting API DTOs into Domain Entities.
 */
export class AuthMapper {
  /**
   * Maps an AuthResultDto object to a domain AuthTokens entity.
   *
   * @param dto Authentication result DTO received from the API.
   * @returns Mapped AuthTokens domain model.
   */
  static fromAuthResultDto(dto: AuthResultDto): AuthTokens {
    return {
      accessToken: dto.accessToken,
      refreshToken: dto.refreshToken,
      expiresIn: dto.expiresIn
    };
  }

  /**
   * Maps a UserProfileDto object to a domain UserProfile entity.
   *
   * @param dto User profile DTO received from the API.
   * @returns Mapped UserProfile domain model.
   */
  static fromUserProfileDto(dto: UserProfileDto): UserProfile {
    return {
      id: dto.id,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      employeeId: dto.employeeId,
      roles: dto.roles ? [...dto.roles] : [],
      permissions: dto.permissions ? [...dto.permissions] : []
    };
  }

  /**
   * Maps a UserSessionDto object to a domain UserSession entity.
   *
   * @param dto User session DTO received from the API.
   * @returns Mapped UserSession domain model.
   */
  static fromUserSessionDto(dto: UserSessionDto): UserSession {
    return {
      id: dto.id,
      createdByIp: dto.createdByIp,
      createdByUserAgent: dto.createdByUserAgent,
      expiresAt: dto.expiresAt
    };
  }

  /**
   * Maps an array of UserSessionDto objects to domain UserSession entities.
   *
   * @param dtos Array of user session DTOs.
   * @returns Array of mapped UserSession domain models.
   */
  static fromUserSessionDtoList(dtos: UserSessionDto[]): UserSession[] {
    if (!dtos) return [];
    return dtos.map(dto => AuthMapper.fromUserSessionDto(dto));
  }

  /**
   * Maps generic operation response DTOs to an OperationResult domain model.
   *
   * @param dto DTO containing outcome message.
   * @returns Mapped OperationResult domain model.
   */
  static toOperationResult(dto: LogoutResponseDto | ForgotPasswordResponseDto | ResetPasswordResponseDto | ChangePasswordResponseDto): OperationResult {
    return {
      message: dto?.message || 'Operation executed successfully.'
    };
  }
}
