export interface LoanEmiScheduleDto {
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

export interface LoanDto {
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

export interface ApplyLoanRequestDto {
  employeeId: number;
  loanType: string;
  principalAmount: number;
  tenureMonths: number;
  reason: string;
}
