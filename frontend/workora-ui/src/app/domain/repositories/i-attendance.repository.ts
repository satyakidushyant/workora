import { Observable } from 'rxjs';
import { PagedResponse } from '../models/api-response.model';
import {
  AttendanceRecord,
  AttendanceCorrection,
  AttendanceSummary,
  LiveAttendanceStatus,
  RequestCorrectionParams
} from '../models/attendance.model';

/**
 * Repository interface for Attendance operations.
 */
export interface IAttendanceRepository {
  checkIn(remarks?: string): Observable<AttendanceRecord>;
  checkOut(remarks?: string): Observable<AttendanceRecord>;
  getTodayStatus(): Observable<AttendanceRecord | null>;
  getAttendanceHistory(employeeId: number, startDate: string, endDate: string): Observable<AttendanceRecord[]>;
  getSummary(employeeId: number, month: number, year: number): Observable<AttendanceSummary>;
  getLiveStatus(companyId?: number): Observable<LiveAttendanceStatus>;
  requestCorrection(params: RequestCorrectionParams): Observable<boolean>;
  getCorrections(pageNumber?: number, pageSize?: number, status?: string): Observable<PagedResponse<AttendanceCorrection>>;
  approveCorrection(id: number, remarks?: string): Observable<boolean>;
  rejectCorrection(id: number, remarks?: string): Observable<boolean>;
}
