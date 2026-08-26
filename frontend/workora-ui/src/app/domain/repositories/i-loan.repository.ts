import { Observable } from 'rxjs';
import { Loan, LoanEmiSchedule, ApplyLoanParams } from '../models/loan.model';

/**
 * Repository interface for Loans and Salary Advances.
 */
export interface ILoanRepository {
  getCompanyLoans(companyId?: number, status?: string): Observable<Loan[]>;
  getMyLoans(): Observable<Loan[]>;
  getLoanById(id: number): Observable<Loan>;
  getLoanSchedule(id: number): Observable<LoanEmiSchedule[]>;
  applyForLoan(params: ApplyLoanParams): Observable<Loan>;
  approveLoan(id: number, approvedByUserId: number): Observable<Loan>;
  rejectLoan(id: number, rejectedByUserId: number, reason: string): Observable<Loan>;
}
