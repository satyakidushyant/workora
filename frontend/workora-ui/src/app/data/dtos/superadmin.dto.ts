export interface OrganizationDto {
  id: number;
  name: string;
  code: string;
  registrationNumber?: string | null;
  taxId?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  currency: string;
  isActive: boolean;
  createdAt: string;
}

export interface SubscriptionPlanDto {
  id: number;
  name: string;
  description: string;
  price: number;
  maxEmployees: number;
  billingCycle: number;
  isActive: boolean;
}

export interface SuperAdminMetricsDto {
  totalOrganizations: number;
  activeOrganizations: number;
  suspendedOrganizations: number;
  totalSystemUsers: number;
  totalEmployees: number;
  activeSubscriptionPlans: number;
}

export interface RegisterOrganizationRequestDto {
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

export interface UpdateOrganizationRequestDto {
  name: string;
  registrationNumber?: string | null;
  taxId?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  fiscalYearStartMonth?: number;
  currency?: string;
  address?: string | null;
}

