export interface OrganizationDto {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  subdomain: string;
  adminEmail: string;
  subscriptionPlanId: number;
  subscriptionPlanName?: string | null;
  status: string;
  createdAt: string;
}

export interface SubscriptionPlanDto {
  id: number;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  maxEmployees: number;
  features: string[];
  isActive: boolean;
}

export interface SuperAdminMetricsDto {
  totalOrganizations: number;
  activeOrganizations: number;
  totalSubscribedUsers: number;
  monthlyRecurringRevenue: number;
}

export interface RegisterOrganizationRequestDto {
  name: string;
  slug: string;
  subdomain: string;
  adminEmail: string;
  subscriptionPlanId: number;
}
