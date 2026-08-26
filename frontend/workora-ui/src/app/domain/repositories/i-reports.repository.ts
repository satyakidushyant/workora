import { Observable } from 'rxjs';
import {
  HeadcountReport,
  AttendanceReport,
  LeaveReport,
  PayrollReport,
  AttritionReport,
  CustomReportExport
} from '../models/reports.model';

export interface IReportsRepository {
  getHeadcountReport(companyId: number): Observable<HeadcountReport>;
  getAttendanceReport(companyId: number): Observable<AttendanceReport>;
  getLeaveReport(companyId: number, year?: number): Observable<LeaveReport>;
  getPayrollReport(companyId: number): Observable<PayrollReport>;
  getAttritionReport(companyId: number, year?: number): Observable<AttritionReport>;
  exportCustomReport(companyId: number, reportType: string, format: string): Observable<CustomReportExport>;
}
