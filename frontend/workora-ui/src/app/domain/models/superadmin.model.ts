export interface TenantOrganization {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  subdomain: string;
  adminEmail: string;
  subscriptionPlanId: number;
  subscriptionPlanName?: string | null;
  status: string; // 'Active' | 'Suspended' | 'Trial'
  createdAt: string;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  maxEmployees: number;
  features: string[];
  isActive: boolean;
}

export interface SuperAdminMetrics {
  totalOrganizations: number;
  activeOrganizations: number;
  totalSubscribedUsers: number;
  monthlyRecurringRevenue: number;
}

export interface RegisterOrganizationParams {
  name: string;
  slug: string;
  subdomain: string;
  adminEmail: string;
  subscriptionPlanId: number;
}
