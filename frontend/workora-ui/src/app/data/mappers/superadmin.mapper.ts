import { OrganizationDto, SubscriptionPlanDto, SuperAdminMetricsDto } from '../dtos/superadmin.dto';
import { TenantOrganization, SubscriptionPlan, SuperAdminMetrics } from '../../domain/models/superadmin.model';

export class SuperAdminMapper {
  static fromOrgDto(dto: OrganizationDto): TenantOrganization {
    return {
      id: dto.id,
      uuid: dto.uuid,
      name: dto.name,
      slug: dto.slug,
      subdomain: dto.subdomain,
      adminEmail: dto.adminEmail,
      subscriptionPlanId: dto.subscriptionPlanId,
      subscriptionPlanName: dto.subscriptionPlanName,
      status: dto.status,
      createdAt: dto.createdAt
    };
  }

  static fromPlanDto(dto: SubscriptionPlanDto): SubscriptionPlan {
    return {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      monthlyPrice: dto.monthlyPrice,
      annualPrice: dto.annualPrice,
      maxEmployees: dto.maxEmployees,
      features: dto.features || [],
      isActive: dto.isActive
    };
  }

  static fromMetricsDto(dto: SuperAdminMetricsDto): SuperAdminMetrics {
    return {
      totalOrganizations: dto.totalOrganizations,
      activeOrganizations: dto.activeOrganizations,
      totalSubscribedUsers: dto.totalSubscribedUsers,
      monthlyRecurringRevenue: dto.monthlyRecurringRevenue
    };
  }
}
