export interface SalaryComponentDto {
  id: number;
  salaryStructureId: number;
  name: string;
  code: string;
  type: string;
  calculationType: string;
  defaultValue: number;
  isTaxable: boolean;
}

export interface SalaryStructureDto {
  id: number;
  uuid: string;
  companyId: number;
  name: string;
  description?: string | null;
  components: SalaryComponentDto[];
  isActive: boolean;
  createdAt: string;
}

export interface EmployeeSalaryAssignmentDto {
  id: number;
  employeeId: number;
  salaryStructureId: number;
  salaryStructureName: string;
  baseSalary: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  isActive: boolean;
  components: SalaryComponentDto[];
}

export interface PayslipItemDto {
  id: number;
  componentName: string;
  componentCode: string;
  type: string;
  amount: number;
}

export interface PayslipDto {
  id: number;
  uuid: string;
  payrollRunId: number;
  employeeId: number;
  employeeCode: string;
  employeeName: string;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  paymentStatus: string;
  paymentDate?: string | null;
  items: PayslipItemDto[];
  createdAt: string;
}

export interface PayrollRunDto {
  id: number;
  uuid: string;
  companyId: number;
  periodMonth: number;
  periodYear: number;
  status: string;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  totalEmployees: number;
  processedAt?: string | null;
  approvedBy?: number | null;
  approvedAt?: string | null;
  disbursedAt?: string | null;
  createdAt: string;
}

export interface PayrollRunDetailDto extends PayrollRunDto {
  payslips: PayslipDto[];
}

export interface PayheadDto {
  id: number;
  name: string;
  code: string;
  type: string;
  calculationType: string;
  defaultValue: number;
  isTaxable: boolean;
}

export interface CreateSalaryComponentDto {
  name: string;
  code: string;
  type: string;
  calculationType: string;
  defaultValue: number;
  isTaxable: boolean;
}

export interface CreateSalaryStructureRequestDto {
  companyId: number;
  name: string;
  description?: string | null;
  components: CreateSalaryComponentDto[];
}

export interface UpdateSalaryStructureRequestDto {
  name: string;
  description?: string | null;
  components: CreateSalaryComponentDto[];
}

export interface AssignSalaryStructureRequestDto {
  employeeId: number;
  salaryStructureId: number;
  baseSalary: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
}

export interface CreatePayrollRunRequestDto {
  companyId: number;
  periodMonth: number;
  periodYear: number;
}
