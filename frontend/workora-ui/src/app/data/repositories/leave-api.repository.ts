import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ILeaveRepository } from '../../domain/repositories/i-leave.repository';
import {
  LeaveRequest,
  LeaveBalance,
  LeaveType,
  LeaveCalendarItem,
  LeaveQueryParams,
  ApplyLeaveParams,
  SaveLeaveTypeParams
} from '../../domain/models/leave.model';
import { ApiResponse, PagedResponse } from '../../domain/models/api-response.model';
import {
  LeaveRequestDto,
  LeaveBalanceDto,
  LeaveTypeDto,
  LeaveCalendarItemDto,
  ApplyLeaveRequestDto,
  CreateLeaveTypeRequestDto,
  UpdateLeaveTypeRequestDto,
  ProcessLeaveRequestDto
} from '../dtos/leave.dto';
import { LeaveMapper } from '../mappers/leave.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveApiRepository implements ILeaveRepository {
  private readonly baseUrl = `${environment.apiUrl}/leave`;

  constructor(private readonly http: HttpClient) {}

  applyLeave(params: ApplyLeaveParams): Observable<LeaveRequest> {
    const payload: ApplyLeaveRequestDto = {
      leaveTypeId: params.leaveTypeId,
      startDate: params.startDate,
      endDate: params.endDate,
      daysCount: params.daysCount,
      reason: params.reason
    };

    return this.http.post<ApiResponse<LeaveRequestDto>>(`${this.baseUrl}/requests`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to submit leave request.');
        }
        return LeaveMapper.fromRequestDto(response.data);
      })
    );
  }

  getLeaveRequests(params?: LeaveQueryParams): Observable<PagedResponse<LeaveRequest>> {
    let httpParams = new HttpParams();
    if (params) {
      if (params.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.employeeId) httpParams = httpParams.set('employeeId', params.employeeId.toString());
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.startDate) httpParams = httpParams.set('startDate', params.startDate);
      if (params.endDate) httpParams = httpParams.set('endDate', params.endDate);
    }

    return this.http.get<ApiResponse<PagedResponse<LeaveRequestDto>>>(`${this.baseUrl}/requests`, { params: httpParams }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch leave requests.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(r => LeaveMapper.fromRequestDto(r)),
          totalPages: paged.totalPages || 1,
          totalCount: paged.totalCount || 0,
          pageIndex: paged.pageIndex || (params?.pageNumber || 1),
          pageSize: paged.pageSize || (params?.pageSize || 10),
          hasPreviousPage: paged.hasPreviousPage || false,
          hasNextPage: paged.hasNextPage || false
        };
      })
    );
  }

  approveLeave(id: number, comments?: string): Observable<LeaveRequest> {
    const payload: ProcessLeaveRequestDto = { comments: comments || null };
    return this.http.patch<ApiResponse<LeaveRequestDto>>(`${this.baseUrl}/requests/${id}/approve`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to approve leave request.');
        }
        return LeaveMapper.fromRequestDto(response.data);
      })
    );
  }

  rejectLeave(id: number, comments?: string): Observable<LeaveRequest> {
    const payload: ProcessLeaveRequestDto = { comments: comments || null };
    return this.http.patch<ApiResponse<LeaveRequestDto>>(`${this.baseUrl}/requests/${id}/reject`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to reject leave request.');
        }
        return LeaveMapper.fromRequestDto(response.data);
      })
    );
  }

  cancelLeave(id: number): Observable<LeaveRequest> {
    return this.http.patch<ApiResponse<LeaveRequestDto>>(`${this.baseUrl}/requests/${id}/cancel`, {}).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to cancel leave request.');
        }
        return LeaveMapper.fromRequestDto(response.data);
      })
    );
  }

  getLeaveBalances(employeeId: number, year: number): Observable<LeaveBalance[]> {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<ApiResponse<LeaveBalanceDto[]>>(`${this.baseUrl}/balances/${employeeId}`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch leave balances.');
        }
        return response.data.map(b => LeaveMapper.fromBalanceDto(b));
      })
    );
  }

  getMyLeaveBalances(year = new Date().getFullYear()): Observable<LeaveBalance[]> {
    const params = new HttpParams().set('year', year.toString());
    return this.http.get<ApiResponse<LeaveBalanceDto[]>>(`${this.baseUrl}/balances/me`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch personal leave balances.');
        }
        return response.data.map(b => LeaveMapper.fromBalanceDto(b));
      })
    );
  }

  getLeaveTypes(companyId?: number): Observable<LeaveType[]> {
    let params = new HttpParams();
    if (companyId) params = params.set('companyId', companyId.toString());

    return this.http.get<ApiResponse<LeaveTypeDto[]>>(`${this.baseUrl}/types`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch leave types.');
        }
        return response.data.map(t => LeaveMapper.fromTypeDto(t));
      })
    );
  }

  createLeaveType(params: SaveLeaveTypeParams): Observable<LeaveType> {
    const payload: CreateLeaveTypeRequestDto = {
      companyId: params.companyId || 1,
      name: params.name,
      code: params.code,
      annualQuota: params.annualQuota,
      requiresHrApproval: params.requiresHrApproval,
      allowNegativeBalance: params.allowNegativeBalance,
      description: params.description || null
    };

    return this.http.post<ApiResponse<LeaveTypeDto>>(`${this.baseUrl}/types`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to create leave policy.');
        }
        return LeaveMapper.fromTypeDto(response.data);
      })
    );
  }

  updateLeaveType(params: SaveLeaveTypeParams): Observable<LeaveType> {
    const payload: UpdateLeaveTypeRequestDto = {
      name: params.name,
      code: params.code,
      annualQuota: params.annualQuota,
      requiresHrApproval: params.requiresHrApproval,
      allowNegativeBalance: params.allowNegativeBalance,
      description: params.description || null
    };

    return this.http.put<ApiResponse<LeaveTypeDto>>(`${this.baseUrl}/types/${params.id}`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to update leave policy.');
        }
        return LeaveMapper.fromTypeDto(response.data);
      })
    );
  }

  getLeaveCalendar(startDate: string, endDate: string, departmentId?: number): Observable<LeaveCalendarItem[]> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    if (departmentId) params = params.set('departmentId', departmentId.toString());

    return this.http.get<ApiResponse<LeaveCalendarItemDto[]>>(`${this.baseUrl}/calendar`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch leave calendar.');
        }
        return response.data.map(c => LeaveMapper.fromCalendarItemDto(c));
      })
    );
  }
}
