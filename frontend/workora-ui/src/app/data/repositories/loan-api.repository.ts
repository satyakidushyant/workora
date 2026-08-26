import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ILoanRepository } from '../../domain/repositories/i-loan.repository';
import { Loan, LoanEmiSchedule, ApplyLoanParams } from '../../domain/models/loan.model';
import { ApiResponse } from '../../domain/models/api-response.model';
import { LoanDto, LoanEmiScheduleDto, ApplyLoanRequestDto } from '../dtos/loan.dto';
import { LoanMapper } from '../mappers/loan.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoanApiRepository implements ILoanRepository {
  private readonly baseUrl = `${environment.apiUrl}/loans`;

  constructor(private readonly http: HttpClient) {}

  getCompanyLoans(companyId?: number, status?: string): Observable<Loan[]> {
    let params = new HttpParams();
    if (companyId) params = params.set('companyId', companyId.toString());
    if (status) params = params.set('status', status);

    return this.http.get<ApiResponse<LoanDto[]>>(this.baseUrl, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch loans.');
        }
        return response.data.map(l => LoanMapper.fromLoanDto(l));
      })
    );
  }

  getMyLoans(): Observable<Loan[]> {
    return this.http.get<ApiResponse<LoanDto[]>>(`${this.baseUrl}/me`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch personal loans.');
        }
        return response.data.map(l => LoanMapper.fromLoanDto(l));
      })
    );
  }

  getLoanById(id: number): Observable<Loan> {
    return this.http.get<ApiResponse<LoanDto>>(`${this.baseUrl}/${id}`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || `Failed to fetch loan #${id}.`);
        }
        return LoanMapper.fromLoanDto(response.data);
      })
    );
  }

  getLoanSchedule(id: number): Observable<LoanEmiSchedule[]> {
    return this.http.get<ApiResponse<LoanEmiScheduleDto[]>>(`${this.baseUrl}/${id}/schedule`).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch loan EMI schedule.');
        }
        return response.data.map(s => LoanMapper.fromEmiScheduleDto(s));
      })
    );
  }

  applyForLoan(params: ApplyLoanParams): Observable<Loan> {
    const payload: ApplyLoanRequestDto = {
      employeeId: params.employeeId,
      loanType: params.loanType,
      principalAmount: params.principalAmount,
      tenureMonths: params.tenureMonths,
      reason: params.reason
    };

    return this.http.post<ApiResponse<LoanDto>>(`${this.baseUrl}/apply`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to submit loan application.');
        }
        return LoanMapper.fromLoanDto(response.data);
      })
    );
  }

  approveLoan(id: number, approvedByUserId = 1): Observable<Loan> {
    return this.http.patch<ApiResponse<LoanDto>>(`${this.baseUrl}/${id}/approve`, approvedByUserId).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to approve loan.');
        }
        return LoanMapper.fromLoanDto(response.data);
      })
    );
  }

  rejectLoan(id: number, rejectedByUserId: number, reason: string): Observable<Loan> {
    return this.http.patch<ApiResponse<LoanDto>>(`${this.baseUrl}/${id}/reject`, {
      rejectedByUserId,
      rejectionReason: reason
    }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to reject loan.');
        }
        return LoanMapper.fromLoanDto(response.data);
      })
    );
  }
}
