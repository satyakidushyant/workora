import { Observable } from 'rxjs';
import { PagedResponse } from '../models/api-response.model';
import {
  LeaveRequest,
  LeaveBalance,
  LeaveType,
  LeaveCalendarItem,
  LeaveQueryParams,
  ApplyLeaveParams,
  SaveLeaveTypeParams
} from '../models/leave.model';

/**
 * Repository interface for Leave applications, balances, and policies.
 */
export interface ILeaveRepository {
  applyLeave(params: ApplyLeaveParams): Observable<LeaveRequest>;
  getLeaveRequests(params?: LeaveQueryParams): Observable<PagedResponse<LeaveRequest>>;
  approveLeave(id: number, comments?: string): Observable<LeaveRequest>;
  rejectLeave(id: number, comments?: string): Observable<LeaveRequest>;
  cancelLeave(id: number): Observable<LeaveRequest>;
  getLeaveBalances(employeeId: number, year: number): Observable<LeaveBalance[]>;
  getMyLeaveBalances(year?: number): Observable<LeaveBalance[]>;
  getLeaveTypes(companyId?: number): Observable<LeaveType[]>;
  createLeaveType(params: SaveLeaveTypeParams): Observable<LeaveType>;
  updateLeaveType(params: SaveLeaveTypeParams): Observable<LeaveType>;
  getLeaveCalendar(startDate: string, endDate: string, departmentId?: number): Observable<LeaveCalendarItem[]>;
}
