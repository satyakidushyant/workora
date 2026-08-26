import { Observable } from 'rxjs';
import { PagedResponse } from '../models/api-response.model';
import { AuditLog, AuditLogQueryParams } from '../models/audit-log.model';

/**
 * Repository interface for immutable Audit Trail query operations.
 */
export interface IAuditLogRepository {
  getAuditLogs(params?: AuditLogQueryParams): Observable<PagedResponse<AuditLog>>;
  getEntityAuditLogs(entity: string, id: number): Observable<AuditLog[]>;
  exportAuditLogs(companyId: number): Observable<string>;
}
