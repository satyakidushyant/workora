/**
 * Domain model representing an employee expense reimbursement claim.
 */
export interface ExpenseClaim {
  id: number;
  uuid: string;
  employeeId: number;
  employeeName?: string | null;
  employeeCode?: string | null;
  category: string;
  expenseDate: string;
  amount: number;
  merchantName?: string | null;
  description: string;
  receiptUrl: string;
  status: string;
  managerApprovedByUserId?: number | null;
  managerApprovedAt?: string | null;
  financeApprovedByUserId?: number | null;
  financeApprovedAt?: string | null;
  rejectionReason?: string | null;
  payrollRunId?: number | null;
  createdAt: string;
}

/**
 * Parameters for submitting an expense claim.
 */
export interface SubmitExpenseParams {
  employeeId: number;
  category: string;
  expenseDate: string;
  amount: number;
  merchantName?: string | null;
  description: string;
  receiptUrl: string;
}
