import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAttendanceRepository } from '../../domain/repositories/i-attendance.repository';
import {
  AttendanceRecord,
  AttendanceCorrection,
  AttendanceSummary,
  LiveAttendanceStatus,
  RequestCorrectionParams
} from '../../domain/models/attendance.model';
import { ApiResponse, PagedResponse } from '../../domain/models/api-response.model';
import {
  AttendanceRecordDto,
  AttendanceCorrectionDto,
  AttendanceSummaryDto,
  LiveAttendanceStatusDto,
  CheckInRequestDto,
  CheckOutRequestDto,
  RequestCorrectionRequestDto,
  ProcessCorrectionRequestDto
} from '../dtos/attendance.dto';
import { AttendanceMapper } from '../mappers/attendance.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceApiRepository implements IAttendanceRepository {
  private readonly baseUrl = `${environment.apiUrl}/attendance`;

  constructor(private readonly http: HttpClient) {}

  checkIn(remarks?: string): Observable<AttendanceRecord> {
    const payload: CheckInRequestDto = { remarks: remarks || null };
    return this.http.post<ApiResponse<AttendanceRecordDto>>(`${this.baseUrl}/check-in`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Check-in failed.');
        }
        return AttendanceMapper.fromRecordDto(response.data);
      })
    );
  }

  checkOut(remarks?: string): Observable<AttendanceRecord> {
    const payload: CheckOutRequestDto = { remarks: remarks || null };
    return this.http.post<ApiResponse<AttendanceRecordDto>>(`${this.baseUrl}/check-out`, payload).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Check-out failed.');
        }
        return AttendanceMapper.fromRecordDto(response.data);
      })
    );
  }

  getTodayStatus(): Observable<AttendanceRecord | null> {
    return this.http.get<ApiResponse<AttendanceRecordDto | null>>(`${this.baseUrl}/today`).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to fetch today status.');
        }
        return response.data ? AttendanceMapper.fromRecordDto(response.data) : null;
      })
    );
  }

  getAttendanceHistory(employeeId: number, startDate: string, endDate: string): Observable<AttendanceRecord[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<ApiResponse<AttendanceRecordDto[]>>(`${this.baseUrl}/${employeeId}`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch attendance history.');
        }
        return response.data.map(r => AttendanceMapper.fromRecordDto(r));
      })
    );
  }

  getSummary(employeeId: number, month: number, year: number): Observable<AttendanceSummary> {
    const params = new HttpParams()
      .set('employeeId', employeeId.toString())
      .set('month', month.toString())
      .set('year', year.toString());

    return this.http.get<ApiResponse<AttendanceSummaryDto>>(`${this.baseUrl}/summary`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch monthly attendance summary.');
        }
        return AttendanceMapper.fromSummaryDto(response.data);
      })
    );
  }

  getLiveStatus(companyId: number): Observable<LiveAttendanceStatus> {
    const params = new HttpParams().set('companyId', companyId.toString());
    return this.http.get<ApiResponse<LiveAttendanceStatusDto>>(`${this.baseUrl}/live-status`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch live presence metrics.');
        }
        return AttendanceMapper.fromLiveStatusDto(response.data);
      })
    );
  }

  requestCorrection(params: RequestCorrectionParams): Observable<boolean> {
    const payload: RequestCorrectionRequestDto = {
      requestedCheckInTime: params.requestedCheckInTime || null,
      requestedCheckOutTime: params.requestedCheckOutTime || null,
      reason: params.reason
    };

    return this.http.post<ApiResponse<boolean>>(`${this.baseUrl}/${params.attendanceRecordId}/correction`, payload).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to submit correction request.');
        }
        return response.data ?? true;
      })
    );
  }

  getCorrections(pageNumber = 1, pageSize = 10, status?: string): Observable<PagedResponse<AttendanceCorrection>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<ApiResponse<PagedResponse<AttendanceCorrectionDto>>>(`${this.baseUrl}/corrections`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch correction requests.');
        }
        const paged = response.data;
        return {
          items: (paged.items || []).map(c => AttendanceMapper.fromCorrectionDto(c)),
          totalPages: paged.totalPages || 1,
          totalCount: paged.totalCount || 0,
          pageIndex: paged.pageIndex || pageNumber,
          pageSize: paged.pageSize || pageSize,
          hasPreviousPage: paged.hasPreviousPage || false,
          hasNextPage: paged.hasNextPage || false
        };
      })
    );
  }

  approveCorrection(id: number, remarks?: string): Observable<boolean> {
    const payload: ProcessCorrectionRequestDto = { remarks: remarks || null };
    return this.http.patch<ApiResponse<boolean>>(`${this.baseUrl}/corrections/${id}/approve`, payload).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to approve correction.');
        }
        return response.data ?? true;
      })
    );
  }

  rejectCorrection(id: number, remarks?: string): Observable<boolean> {
    const payload: ProcessCorrectionRequestDto = { remarks: remarks || null };
    return this.http.patch<ApiResponse<boolean>>(`${this.baseUrl}/corrections/${id}/reject`, payload).pipe(
      map(response => {
        if (!response.isSuccess) {
          throw new Error(response.message || 'Failed to reject correction.');
        }
        return response.data ?? true;
      })
    );
  }
}
