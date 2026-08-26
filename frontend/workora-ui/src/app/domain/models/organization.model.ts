/**
 * Domain model representing a company entity.
 */
export interface Company {
  id: number;
  uuid: string;
  name: string;
  code: string;
  registrationNumber?: string | null;
  taxId?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  fiscalYearStartMonth: number;
  currency: string;
  address?: string | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * Parameters for updating company profile.
 */
export interface UpdateCompanyProfileParams {
  id?: number;
  name: string;
  registrationNumber?: string | null;
  taxId?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  fiscalYearStartMonth: number;
  currency: string;
  address?: string | null;
}

/**
 * Domain model representing a branch office.
 */
export interface Branch {
  id: number;
  uuid: string;
  companyId: number;
  companyName?: string | null;
  name: string;
  code: string;
  location: string;
  address?: string | null;
  timezone: string;
  isHeadOffice: boolean;
  isActive: boolean;
  createdAt: string;
}

/**
 * Query parameters for fetching paginated branches.
 */
export interface BranchQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  companyId?: number;
}

/**
 * Parameters for creating a branch.
 */
export interface CreateBranchParams {
  companyId: number;
  name: string;
  code: string;
  location: string;
  address?: string | null;
  timezone: string;
  isHeadOffice: boolean;
}

/**
 * Parameters for updating a branch.
 */
export interface UpdateBranchParams {
  id: number;
  name: string;
  code: string;
  location: string;
  address?: string | null;
  timezone: string;
  isHeadOffice: boolean;
}

/**
 * Domain model representing a designation / job role.
 */
export interface Designation {
  id: number;
  uuid: string;
  departmentId: number;
  departmentName?: string | null;
  title: string;
  level: number;
  grade?: string | null;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * Query parameters for fetching paginated designations.
 */
export interface DesignationQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  departmentId?: number;
}

/**
 * Parameters for creating a designation.
 */
export interface CreateDesignationParams {
  departmentId: number;
  title: string;
  level: number;
  grade?: string | null;
  description?: string | null;
}

/**
 * Parameters for updating a designation.
 */
export interface UpdateDesignationParams {
  id: number;
  departmentId: number;
  title: string;
  level: number;
  grade?: string | null;
  description?: string | null;
}

/**
 * Domain model representing a department summary.
 */
export interface Department {
  id: number;
  uuid: string;
  companyId: number;
  companyName?: string | null;
  code: string;
  name: string;
  headEmployeeId?: number | null;
  parentDepartmentId?: number | null;
  parentDepartmentName?: string | null;
  designationsCount: number;
  isActive: boolean;
  createdAt: string;
}

/**
 * Domain model representing full department details with child designations & sub-departments.
 */
export interface DepartmentDetail extends Department {
  designations: Designation[];
  subDepartments: Department[];
}

/**
 * Query parameters for fetching paginated departments.
 */
export interface DepartmentQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  companyId?: number;
}

/**
 * Parameters for creating a department.
 */
export interface CreateDepartmentParams {
  companyId: number;
  code: string;
  name: string;
  headEmployeeId?: number | null;
  parentDepartmentId?: number | null;
}

/**
 * Parameters for updating a department.
 */
export interface UpdateDepartmentParams {
  id: number;
  code: string;
  name: string;
  headEmployeeId?: number | null;
  parentDepartmentId?: number | null;
}

/**
 * Parameters for assigning department head.
 */
export interface AssignDepartmentHeadParams {
  departmentId: number;
  headEmployeeId?: number | null;
}
