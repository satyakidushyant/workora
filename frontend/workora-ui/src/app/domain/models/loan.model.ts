/**
 * Domain model representing an installment in an EMI schedule.
 */
export interface LoanEmiSchedule {
  id: number;
  uuid: string;
  loanRecordId: number;
  installmentNumber: number;
  dueDate: string;
  emiAmount: number;
  principalComponent: number;
  interestComponent: number;
  isPaid: boolean;
  paidAt?: string | null;
  payrollRunId?: number | null;
}

/**
 * Domain model representing an employee loan account.
 */
export interface Loan {
  id: number;
  uuid: string;
  employeeId: number;
  employeeName?: string | null;
  employeeCode?: string | null;
  loanType: string;
  principalAmount: number;
  tenureMonths: number;
  monthlyEmi: number;
  totalRepaid: number;
  remainingBalance: number;
  disbursementDate: string;
  status: string;
  reason: string;
  approvedByUserId?: number | null;
  approvedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
}

/**
 * Parameters for applying for a loan / salary advance.
 */
export interface ApplyLoanParams {
  employeeId: number;
  loanType: string;
  principalAmount: number;
  tenureMonths: number;
  reason: string;
}
