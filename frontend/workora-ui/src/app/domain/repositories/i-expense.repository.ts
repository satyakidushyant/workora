import { Observable } from 'rxjs';
import { ExpenseClaim, SubmitExpenseParams } from '../models/expense.model';

/**
 * Repository interface for Employee Expense Claims and Reimbursements.
 */
export interface IExpenseRepository {
  getExpenseClaims(status?: string, category?: string): Observable<ExpenseClaim[]>;
  getMyExpenses(): Observable<ExpenseClaim[]>;
  getExpenseClaimById(id: number): Observable<ExpenseClaim>;
  submitExpenseClaim(params: SubmitExpenseParams): Observable<ExpenseClaim>;
  approveByManager(id: number, managerUserId: number): Observable<ExpenseClaim>;
  approveByFinance(id: number, financeUserId: number): Observable<ExpenseClaim>;
  rejectExpenseClaim(id: number, reviewerUserId: number, reason: string): Observable<ExpenseClaim>;
}
