import { OrganizationDto, SubscriptionPlanDto, SuperAdminMetricsDto } from '../dtos/superadmin.dto';
import { TenantOrganization, SubscriptionPlan, SuperAdminMetrics } from '../../domain/models/superadmin.model';

export class SuperAdminMapper {
  static fromOrgDto(dto: any): TenantOrganization {
    return {
      id: dto.id,
      name: dto.name,
      code: dto.code,
      registrationNumber: dto.registrationNumber,
      taxId: dto.taxId,
      email: dto.email,
      phone: dto.phone,
      website: dto.website,
      logoUrl: dto.logoUrl,
      address: dto.address,
      fiscalYearStartMonth: dto.fiscalYearStartMonth || 4,
      branchCount: dto.branchCount || 0,
      employeeCount: dto.employeeCount || 0,
      subscriptionPlan: dto.subscriptionPlan || 'Growth',
      industry: dto.industry || 'Information Technology',
      primaryContactName: dto.primaryContactName || (dto.name ? `${dto.name} Admin` : 'Admin'),
      currency: dto.currency || 'INR',
      isActive: dto.isActive !== undefined ? dto.isActive : true,
      createdAt: dto.createdAt
    };
  }

  static fromPlanDto(dto: SubscriptionPlanDto): SubscriptionPlan {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      maxEmployees: dto.maxEmployees,
      billingCycle: dto.billingCycle,
      isActive: dto.isActive
    };
  }

  static fromMetricsDto(dto: SuperAdminMetricsDto): SuperAdminMetrics {
    return {
      totalOrganizations: dto.totalOrganizations,
      activeOrganizations: dto.activeOrganizations,
      suspendedOrganizations: dto.suspendedOrganizations,
      totalSystemUsers: dto.totalSystemUsers,
      totalEmployees: dto.totalEmployees,
      activeSubscriptionPlans: dto.activeSubscriptionPlans
    };
  }
}
