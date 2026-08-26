/**
 * DTO representing company summary.
 */
export interface CompanyDto {
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
 * DTO for updating company profile.
 */
export interface UpdateCompanyProfileRequestDto {
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
 * DTO for uploading company logo.
 */
export interface UploadCompanyLogoRequestDto {
  logoUrl: string;
}

/**
 * DTO representing branch summary.
 */
export interface BranchDto {
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
 * DTO for creating a branch.
 */
export interface CreateBranchRequestDto {
  companyId: number;
  name: string;
  code: string;
  location: string;
  address?: string | null;
  timezone: string;
  isHeadOffice: boolean;
}

/**
 * DTO for updating a branch.
 */
export interface UpdateBranchRequestDto {
  name: string;
  code: string;
  location: string;
  address?: string | null;
  timezone: string;
  isHeadOffice: boolean;
}

/**
 * DTO representing designation summary.
 */
export interface DesignationDto {
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
 * DTO for creating a designation.
 */
export interface CreateDesignationRequestDto {
  departmentId: number;
  title: string;
  level: number;
  grade?: string | null;
  description?: string | null;
}

/**
 * DTO for updating a designation.
 */
export interface UpdateDesignationRequestDto {
  departmentId: number;
  title: string;
  level: number;
  grade?: string | null;
  description?: string | null;
}

/**
 * DTO representing department summary.
 */
export interface DepartmentDto {
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
 * DTO representing department detail with designations and sub-departments.
 */
export interface DepartmentDetailDto {
  id: number;
  uuid: string;
  companyId: number;
  companyName?: string | null;
  code: string;
  name: string;
  headEmployeeId?: number | null;
  parentDepartmentId?: number | null;
  parentDepartmentName?: string | null;
  designations: DesignationDto[];
  subDepartments: DepartmentDto[];
  isActive: boolean;
  createdAt: string;
}

/**
 * DTO for creating a department.
 */
export interface CreateDepartmentRequestDto {
  companyId: number;
  code: string;
  name: string;
  headEmployeeId?: number | null;
  parentDepartmentId?: number | null;
}

/**
 * DTO for updating a department.
 */
export interface UpdateDepartmentRequestDto {
  code: string;
  name: string;
  headEmployeeId?: number | null;
  parentDepartmentId?: number | null;
}

/**
 * DTO for assigning a department head.
 */
export interface AssignDepartmentHeadRequestDto {
  headEmployeeId?: number | null;
}
