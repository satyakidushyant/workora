import { Observable } from 'rxjs';
import { PagedResponse } from '../models/api-response.model';
import {
  TenantOrganization,
  SubscriptionPlan,
  SuperAdminMetrics,
  RegisterOrganizationParams
} from '../models/superadmin.model';

export interface ISuperAdminRepository {
  getOrganizations(pageNumber?: number, pageSize?: number, status?: string): Observable<PagedResponse<TenantOrganization>>;
  getOrganizationById(id: number): Observable<TenantOrganization>;
  registerOrganization(params: RegisterOrganizationParams): Observable<TenantOrganization>;
  suspendOrganization(id: number): Observable<boolean>;
  reactivateOrganization(id: number): Observable<boolean>;

  getPlans(): Observable<SubscriptionPlan[]>;
  getMetrics(): Observable<SuperAdminMetrics>;
}
