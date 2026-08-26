export interface EmployeeDto {
  id: number;
  uuid: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string | null;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  hireDate: string;
  departmentId: number;
  departmentName?: string | null;
  designationId: number;
  designationTitle?: string | null;
  branchId: number;
  branchName?: string | null;
  managerId?: number | null;
  managerName?: string | null;
  userId?: number | null;
  employmentStatus: string;
  employmentType: string;
  terminationDate?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface EmergencyContactDto {
  id: number;
  name: string;
  relationship: string;
  phoneNumber: string;
  alternativePhoneNumber?: string | null;
  isPrimary: boolean;
}

export interface BankDetailDto {
  id: number;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branchCode?: string | null;
  swiftCode?: string | null;
  isPrimary: boolean;
}

export interface EmploymentHistoryDto {
  id: number;
  effectiveDate: string;
  eventType: string;
  previousDepartmentId?: number | null;
  newDepartmentId?: number | null;
  previousDesignationId?: number | null;
  newDesignationId?: number | null;
  previousBranchId?: number | null;
  newBranchId?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface EmployeeDetailDto extends EmployeeDto {
  terminationReason?: string | null;
  address?: string | null;
  emergencyContacts: EmergencyContactDto[];
  bankDetails: BankDetailDto[];
  employmentHistory: EmploymentHistoryDto[];
}

export interface OrgChartNodeDto {
  id: number;
  employeeCode: string;
  fullName: string;
  designationTitle?: string | null;
  departmentName?: string | null;
  managerId?: number | null;
  directReports: OrgChartNodeDto[];
}

export interface CreateEmployeeRequestDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  hireDate: string;
  departmentId: number;
  designationId: number;
  branchId: number;
  managerId?: number | null;
  employmentType: string;
  address?: string | null;
}

export interface UpdateEmployeeRequestDto {
  firstName: string;
  lastName: string;
  phone?: string | null;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  managerId?: number | null;
  address?: string | null;
}

export interface TransferEmployeeRequestDto {
  departmentId: number;
  designationId: number;
  branchId: number;
  managerId?: number | null;
  notes?: string | null;
}

export interface TerminateEmployeeRequestDto {
  terminationDate: string;
  reason?: string | null;
}

export interface ReactivateEmployeeRequestDto {
  departmentId: number;
  designationId: number;
  branchId: number;
  managerId?: number | null;
  notes?: string | null;
}

export interface UpsertEmergencyContactRequestDto {
  id?: number;
  name: string;
  relationship: string;
  phoneNumber: string;
  alternativePhoneNumber?: string | null;
  isPrimary: boolean;
}

export interface UpsertBankDetailsRequestDto {
  id?: number;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branchCode?: string | null;
  swiftCode?: string | null;
  isPrimary: boolean;
}
