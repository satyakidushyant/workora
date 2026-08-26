export interface AuditLogDto {
  id: number;
  userId?: number | null;
  actorEmail?: string | null;
  action: string;
  entityName: string;
  entityId?: string | null;
  oldValues?: string | null;
  newValues?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  timestamp: string;
}
