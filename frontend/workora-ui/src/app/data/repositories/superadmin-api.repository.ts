import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ISuperAdminRepository } from '../../domain/repositories/i-superadmin.repository';
import {
  TenantOrganization,
  SubscriptionPlan,
  SuperAdminMetrics,
  RegisterOrganizationParams
} from '../../domain/models/superadmin.model';
import { ApiResponse, PagedResponse } from '../../domain/models/api-response.model';
import {
  OrganizationDto,
  SubscriptionPlanDto,
  SuperAdminMetricsDto,
  RegisterOrganizationRequestDto
} from '../dtos/superadmin.dto';
import { SuperAdminMapper } from '../mappers/superadmin.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminApiRepository implements ISuperAdminRepository {
  private readonly baseUrl = `${environment.apiUrl}/superadmin`;

  constructor(private readonly http: HttpClient) {}

  getOrganizations(pageNumber = 1, pageSize = 10, status?: string): Observable<PagedResponse<TenantOrganization>> {
    let params = new HttpParams().set('pageNumber', pageNumber.toString()).set('pageSize', pageSize.toString());
    if (status) params = params.set('status', status);

    return this.http.get<ApiResponse<PagedResponse<OrganizationDto>>>(`${this.baseUrl}/organizations`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch tenant organizations.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(o => SuperAdminMapper.fromOrgDto(o)),
          totalPages: paged.totalPages || 1,
          totalCount: paged.totalCount || 0,
          pageIndex: paged.pageIndex || pageNumber,
          pageSize: paged.pageSize || pageSize,
          hasPreviousPage: paged.hasPreviousPage || false,
          hasNextPage: paged.hasNextPage || false
        };
      })
    );
  }

  getOrganizationById(id: number): Observable<TenantOrganization> {
    return this.http.get<ApiResponse<OrganizationDto>>(`${this.baseUrl}/organizations/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch organization #${id}.`);
        }
        return SuperAdminMapper.fromOrgDto(response.data);
      })
    );
  }

  registerOrganization(params: RegisterOrganizationParams): Observable<TenantOrganization> {
    const payload: RegisterOrganizationRequestDto = {
      name: params.name,
      slug: params.slug,
      subdomain: params.subdomain,
      adminEmail: params.adminEmail,
      subscriptionPlanId: params.subscriptionPlanId
    };

    return this.http.post<ApiResponse<OrganizationDto>>(`${this.baseUrl}/organizations`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to register tenant organization.');
        }
        return SuperAdminMapper.fromOrgDto(response.data);
      })
    );
  }

  suspendOrganization(id: number): Observable<boolean> {
    return this.http.patch<ApiResponse<boolean>>(`${this.baseUrl}/organizations/${id}/suspend`, {}).pipe(
      map(response => response.isSuccess && !!response.data)
    );
  }

  reactivateOrganization(id: number): Observable<boolean> {
    return this.http.patch<ApiResponse<boolean>>(`${this.baseUrl}/organizations/${id}/reactivate`, {}).pipe(
      map(response => response.isSuccess && !!response.data)
    );
  }

  getPlans(): Observable<SubscriptionPlan[]> {
    return this.http.get<ApiResponse<SubscriptionPlanDto[]>>(`${this.baseUrl}/plans`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch subscription plans.');
        }
        return response.data.map(p => SuperAdminMapper.fromPlanDto(p));
      })
    );
  }

  getMetrics(): Observable<SuperAdminMetrics> {
    return this.http.get<ApiResponse<SuperAdminMetricsDto>>(`${this.baseUrl}/metrics`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch platform metrics.');
        }
        return SuperAdminMapper.fromMetricsDto(response.data);
      })
    );
  }
}
