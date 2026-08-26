/**
 * Domain model representing a payhead or salary component definition.
 */
export interface Payhead {
  id: number;
  name: string;
  code: string;
  type: string; // 'Earning' | 'Deduction'
  calculationType: string; // 'Fixed' | 'PercentageOfBasic' | 'PercentageOfGross'
  defaultValue: number;
  isTaxable: boolean;
}

/**
 * Domain model representing a component within a salary structure template.
 */
export interface SalaryComponent {
  id: number;
  salaryStructureId: number;
  name: string;
  code: string;
  type: string;
  calculationType: string;
  defaultValue: number;
  isTaxable: boolean;
}

/**
 * Domain model representing a salary structure template.
 */
export interface SalaryStructure {
  id: number;
  uuid: string;
  companyId: number;
  name: string;
  description?: string | null;
  components: SalaryComponent[];
  isActive: boolean;
  createdAt: string;
}

/**
 * Domain model representing an employee's assigned compensation structure.
 */
export interface EmployeeSalaryAssignment {
  id: number;
  employeeId: number;
  salaryStructureId: number;
  salaryStructureName: string;
  baseSalary: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
  isActive: boolean;
  components: SalaryComponent[];
}

/**
 * Domain model representing a line item in a payslip.
 */
export interface PayslipItem {
  id: number;
  componentName: string;
  componentCode: string;
  type: string;
  amount: number;
}

/**
 * Domain model representing an individual employee payslip.
 */
export interface Payslip {
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
  items: PayslipItem[];
  createdAt: string;
}

/**
 * Domain model representing a monthly payroll computation cycle.
 */
export interface PayrollRun {
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

/**
 * Domain model representing a payroll run with all itemized payslips.
 */
export interface PayrollRunDetail extends PayrollRun {
  payslips: Payslip[];
}

/**
 * Parameters for creating a salary structure.
 */
export interface SaveSalaryStructureParams {
  id?: number;
  companyId: number;
  name: string;
  description?: string | null;
  components: {
    name: string;
    code: string;
    type: string;
    calculationType: string;
    defaultValue: number;
    isTaxable: boolean;
  }[];
}

/**
 * Parameters for assigning salary structure to an employee.
 */
export interface AssignSalaryStructureParams {
  employeeId: number;
  salaryStructureId: number;
  baseSalary: number;
  effectiveFrom: string;
  effectiveTo?: string | null;
}

/**
 * Parameters for executing a payroll computation run.
 */
export interface CreatePayrollRunParams {
  companyId: number;
  periodMonth: number;
  periodYear: number;
}
