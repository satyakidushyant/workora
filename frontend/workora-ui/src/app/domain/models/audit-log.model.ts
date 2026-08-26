/**
 * Domain model representing an immutable security audit trail log.
 */
export interface AuditLog {
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

/**
 * Query parameters for searching audit logs.
 */
export interface AuditLogQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  entityName?: string;
  action?: string;
  userId?: number;
}
