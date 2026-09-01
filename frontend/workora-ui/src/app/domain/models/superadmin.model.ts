/**
 * Domain model representing a tenant organization / company.
 */
export interface TenantOrganization {
  id: number;
  name: string;
  code: string;
  registrationNumber?: string | null;
  taxId?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  address?: string | null;
  fiscalYearStartMonth?: number;
  branchCount?: number;
  employeeCount?: number;
  subscriptionPlan?: string;
  industry?: string | null;
  primaryContactName?: string | null;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Domain model representing a platform subscription plan.
 */
export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  maxEmployees: number;
  billingCycle: number | string;
  isActive: boolean;
}

/**
 * Domain model representing platform global metrics.
 */
export interface SuperAdminMetrics {
  totalOrganizations: number;
  activeOrganizations: number;
  suspendedOrganizations: number;
  totalSystemUsers: number;
  totalEmployees: number;
  activeSubscriptionPlans: number;
}

/**
 * Parameters for registering a new tenant organization.
 */
export interface RegisterOrganizationParams {
  name: string;
  code: string;
  registrationNumber?: string | null;
  taxId?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  fiscalYearStartMonth?: number;
  currency?: string;
  address?: string | null;
}

/**
 * Parameters for updating an existing tenant organization.
 */
export interface UpdateOrganizationParams {
  id: number;
  name: string;
  registrationNumber?: string | null;
  taxId?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  fiscalYearStartMonth?: number;
  currency?: string;
  address?: string | null;
  industry?: string | null;
  primaryContactName?: string | null;
}


