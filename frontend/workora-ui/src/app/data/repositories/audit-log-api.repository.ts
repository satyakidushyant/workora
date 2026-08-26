import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAuditLogRepository } from '../../domain/repositories/i-audit-log.repository';
import { AuditLog, AuditLogQueryParams } from '../../domain/models/audit-log.model';
import { ApiResponse, PagedResponse } from '../../domain/models/api-response.model';
import { AuditLogDto } from '../dtos/audit-log.dto';
import { AuditLogMapper } from '../mappers/audit-log.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditLogApiRepository implements IAuditLogRepository {
  private readonly baseUrl = `${environment.apiUrl}/audit-logs`;

  constructor(private readonly http: HttpClient) {}

  getAuditLogs(params?: AuditLogQueryParams): Observable<PagedResponse<AuditLog>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);
      if (params.entityName) httpParams = httpParams.set('entityName', params.entityName);
      if (params.action) httpParams = httpParams.set('action', params.action);
      if (params.userId) httpParams = httpParams.set('userId', params.userId.toString());
    }

    return this.http.get<ApiResponse<PagedResponse<AuditLogDto>>>(this.baseUrl, { params: httpParams }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch audit logs.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(a => AuditLogMapper.fromAuditLogDto(a)),
          totalPages: paged.totalPages || 1,
          totalCount: paged.totalCount || 0,
          pageIndex: paged.pageIndex || (params?.pageNumber || 1),
          pageSize: paged.pageSize || (params?.pageSize || 10),
          hasPreviousPage: paged.hasPreviousPage || false,
          hasNextPage: paged.hasNextPage || false
        };
      })
    );
  }

  getEntityAuditLogs(entity: string, id: number): Observable<AuditLog[]> {
    return this.http.get<ApiResponse<AuditLogDto[]>>(`${this.baseUrl}/${entity}/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch entity audit trail.');
        }
        return response.data.map(a => AuditLogMapper.fromAuditLogDto(a));
      })
    );
  }

  exportAuditLogs(companyId: number): Observable<string> {
    const params = new HttpParams().set('companyId', companyId.toString());
    return this.http.get<ApiResponse<string>>(`${this.baseUrl}/export`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to export audit logs.');
        }
        return response.data;
      })
    );
  }
}
