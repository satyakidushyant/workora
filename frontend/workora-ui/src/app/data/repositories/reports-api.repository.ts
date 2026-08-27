import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IReportsRepository } from '../../domain/repositories/i-reports.repository';
import {
  HeadcountReport,
  AttendanceReport,
  LeaveReport,
  PayrollReport,
  AttritionReport,
  CustomReportExport
} from '../../domain/models/reports.model';
import { ApiResponse } from '../../domain/models/api-response.model';
import {
  HeadcountReportDto,
  AttendanceReportDto,
  LeaveReportDto,
  PayrollReportDto,
  AttritionReportDto,
  CustomReportExportDto
} from '../dtos/reports.dto';
import { ReportsMapper } from '../mappers/reports.mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsApiRepository implements IReportsRepository {
  private readonly baseUrl = `${environment.apiUrl}/reports`;

  constructor(private readonly http: HttpClient) {}

  getHeadcountReport(companyId?: number): Observable<HeadcountReport> {
    let params = new HttpParams();
    if (companyId) params = params.set('companyId', companyId.toString());
    return this.http.get<ApiResponse<HeadcountReportDto>>(`${this.baseUrl}/headcount`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch headcount report.');
        }
        return ReportsMapper.fromHeadcountDto(response.data);
      })
    );
  }

  getAttendanceReport(companyId?: number): Observable<AttendanceReport> {
    let params = new HttpParams();
    if (companyId) params = params.set('companyId', companyId.toString());
    return this.http.get<ApiResponse<AttendanceReportDto>>(`${this.baseUrl}/attendance`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch attendance analytics.');
        }
        return ReportsMapper.fromAttendanceDto(response.data);
      })
    );
  }

  getLeaveReport(companyId?: number, year?: number): Observable<LeaveReport> {
    let params = new HttpParams();
    if (companyId) params = params.set('companyId', companyId.toString());
    if (year) params = params.set('year', year.toString());

    return this.http.get<ApiResponse<LeaveReportDto>>(`${this.baseUrl}/leave`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch leave report.');
        }
        return ReportsMapper.fromLeaveDto(response.data);
      })
    );
  }

  getPayrollReport(companyId?: number): Observable<PayrollReport> {
    let params = new HttpParams();
    if (companyId) params = params.set('companyId', companyId.toString());
    return this.http.get<ApiResponse<PayrollReportDto>>(`${this.baseUrl}/payroll`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch payroll report.');
        }
        return ReportsMapper.fromPayrollDto(response.data);
      })
    );
  }

  getAttritionReport(companyId?: number, year = new Date().getFullYear()): Observable<AttritionReport> {
    let params = new HttpParams();
    if (companyId) params = params.set('companyId', companyId.toString());
    if (year) params = params.set('year', year.toString());
    return this.http.get<ApiResponse<AttritionReportDto>>(`${this.baseUrl}/attrition`, { params }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to fetch attrition report.');
        }
        return ReportsMapper.fromAttritionDto(response.data);
      })
    );
  }

  exportCustomReport(companyId: number, reportType: string, format: string): Observable<CustomReportExport> {
    return this.http.post<ApiResponse<CustomReportExportDto>>(`${this.baseUrl}/custom/export`, { companyId, reportType, format }).pipe(
      map(response => {
        if (!response.isSuccess || !response.data) {
          throw new Error(response.message || 'Failed to export custom report.');
        }
        return ReportsMapper.fromCustomExportDto(response.data);
      })
    );
  }
}
