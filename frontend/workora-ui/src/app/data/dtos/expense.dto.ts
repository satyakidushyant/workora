export interface ExpenseClaimDto {
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

export interface SubmitExpenseClaimRequestDto {
  employeeId: number;
  category: string;
  expenseDate: string;
  amount: number;
  merchantName?: string | null;
  description: string;
  receiptUrl: string;
}
