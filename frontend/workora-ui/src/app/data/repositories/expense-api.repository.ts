import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IExpenseRepository } from '../../domain/repositories/i-expense.repository';
import { ExpenseClaim, SubmitExpenseParams } from '../../domain/models/expense.model';
import { ApiResponse } from '../../domain/models/api-response.model';
import { ExpenseClaimDto, SubmitExpenseClaimRequestDto } from '../dtos/expense.dto';
import { ExpenseMapper } from '../mappers/expense.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseApiRepository implements IExpenseRepository {
  private readonly baseUrl = `${environment.apiUrl}/expenses`;

  constructor(private readonly http: HttpClient) {}

  getExpenseClaims(status?: string, category?: string): Observable<ExpenseClaim[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (category) params = params.set('category', category);

    return this.http.get<ApiResponse<ExpenseClaimDto[]>>(this.baseUrl, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch expense claims.');
        }
        return response.data.map(e => ExpenseMapper.fromExpenseClaimDto(e));
      })
    );
  }

  getMyExpenses(): Observable<ExpenseClaim[]> {
    return this.http.get<ApiResponse<ExpenseClaimDto[]>>(`${this.baseUrl}/me`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch personal expense claims.');
        }
        return response.data.map(e => ExpenseMapper.fromExpenseClaimDto(e));
      })
    );
  }

  getExpenseClaimById(id: number): Observable<ExpenseClaim> {
    return this.http.get<ApiResponse<ExpenseClaimDto>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch expense claim #${id}.`);
        }
        return ExpenseMapper.fromExpenseClaimDto(response.data);
      })
    );
  }

  submitExpenseClaim(params: SubmitExpenseParams): Observable<ExpenseClaim> {
    const payload: SubmitExpenseClaimRequestDto = {
      employeeId: params.employeeId,
      category: params.category,
      expenseDate: params.expenseDate,
      amount: params.amount,
      merchantName: params.merchantName || null,
      description: params.description,
      receiptUrl: params.receiptUrl
    };

    return this.http.post<ApiResponse<ExpenseClaimDto>>(this.baseUrl, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to submit expense claim.');
        }
        return ExpenseMapper.fromExpenseClaimDto(response.data);
      })
    );
  }

  approveByManager(id: number, managerUserId = 1): Observable<ExpenseClaim> {
    return this.http.patch<ApiResponse<ExpenseClaimDto>>(`${this.baseUrl}/${id}/approve-manager`, managerUserId).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to approve expense claim.');
        }
        return ExpenseMapper.fromExpenseClaimDto(response.data);
      })
    );
  }

  approveByFinance(id: number, financeUserId = 1): Observable<ExpenseClaim> {
    return this.http.patch<ApiResponse<ExpenseClaimDto>>(`${this.baseUrl}/${id}/approve-finance`, financeUserId).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to finalize reimbursement.');
        }
        return ExpenseMapper.fromExpenseClaimDto(response.data);
      })
    );
  }

  rejectExpenseClaim(id: number, reviewerUserId: number, reason: string): Observable<ExpenseClaim> {
    return this.http.patch<ApiResponse<ExpenseClaimDto>>(`${this.baseUrl}/${id}/reject`, {
      reviewerUserId,
      reason
    }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to reject expense claim.');
        }
        return ExpenseMapper.fromExpenseClaimDto(response.data);
      })
    );
  }
}
