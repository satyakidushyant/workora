import { AuditLogDto } from '../dtos/audit-log.dto';
import { AuditLog } from '../../domain/models/audit-log.model';

export class AuditLogMapper {
  static fromAuditLogDto(dto: AuditLogDto): AuditLog {
    return {
      id: dto.id,
      userId: dto.userId,
      actorEmail: dto.actorEmail,
      action: dto.action,
      entityName: dto.entityName,
      entityId: dto.entityId,
      oldValues: dto.oldValues,
      newValues: dto.newValues,
      ipAddress: dto.ipAddress,
      userAgent: dto.userAgent,
      timestamp: dto.timestamp
    };
  }
}
