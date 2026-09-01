/**
 * Domain model representing an employee summary in lists and directories.
 */
export interface Employee {
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

/**
 * Domain model representing an emergency contact.
 */
export interface EmergencyContact {
  id: number;
  name: string;
  relationship: string;
  phoneNumber: string;
  alternativePhoneNumber?: string | null;
  isPrimary: boolean;
}

/**
 * Domain model representing bank disbursement details.
 */
export interface BankDetail {
  id: number;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branchCode?: string | null;
  swiftCode?: string | null;
  isPrimary: boolean;
}

/**
 * Domain model representing career transitions and employment history.
 */
export interface EmploymentHistory {
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

/**
 * Domain model representing full 360-degree employee dossier.
 */
export interface EmployeeDetail extends Employee {
  terminationReason?: string | null;
  address?: string | null;
  emergencyContacts: EmergencyContact[];
  bankDetails: BankDetail[];
  employmentHistory: EmploymentHistory[];
}

/**
 * Domain model representing an organizational chart node.
 */
export interface OrgChartNode {
  id: number;
  employeeCode: string;
  fullName: string;
  designationTitle?: string | null;
  departmentName?: string | null;
  managerId?: number | null;
  directReports: OrgChartNode[];
}

/**
 * Query parameters for fetching paginated employees.
 */
export interface EmployeeQueryParams {
  pageNumber?: number;
  pageSize?: number;
  searchTerm?: string;
  departmentId?: number;
  designationId?: number;
  branchId?: number;
  status?: string;
  companyId?: number;
}

/**
 * Parameters for onboarding a new employee.
 */
export interface CreateEmployeeParams {
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
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  bankDetail?: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  };
}

/**
 * Parameters for updating employee profile.
 */
export interface UpdateEmployeeParams {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string | null;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  managerId?: number | null;
  address?: string | null;
}

/**
 * Parameters for transferring or promoting an employee.
 */
export interface TransferEmployeeParams {
  id: number;
  departmentId: number;
  designationId: number;
  branchId: number;
  managerId?: number | null;
  notes?: string | null;
}

/**
 * Parameters for terminating employment.
 */
export interface TerminateEmployeeParams {
  id: number;
  terminationDate: string;
  reason?: string | null;
}

/**
 * Parameters for reactivating a terminated employee.
 */
export interface ReactivateEmployeeParams {
  id: number;
  departmentId: number;
  designationId: number;
  branchId: number;
  managerId?: number | null;
  notes?: string | null;
}

/**
 * Parameters for updating emergency contacts.
 */
export interface UpsertEmergencyContactParams {
  employeeId: number;
  id?: number;
  name: string;
  relationship: string;
  phoneNumber: string;
  alternativePhoneNumber?: string | null;
  isPrimary: boolean;
}

/**
 * Parameters for updating bank disbursement info.
 */
export interface UpsertBankDetailsParams {
  employeeId: number;
  id?: number;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branchCode?: string | null;
  swiftCode?: string | null;
  isPrimary: boolean;
}
