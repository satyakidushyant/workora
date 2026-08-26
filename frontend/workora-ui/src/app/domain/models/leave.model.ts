/**
 * Domain model representing a configured leave type policy.
 */
export interface LeaveType {
  id: number;
  uuid: string;
  companyId: number;
  name: string;
  code: string;
  annualQuota: number;
  requiresHrApproval: boolean;
  allowNegativeBalance: boolean;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
}

/**
 * Domain model representing a leave approval action.
 */
export interface LeaveApproval {
  id: number;
  leaveRequestId: number;
  approverEmployeeId: number;
  approverRole: string;
  status: string;
  comments?: string | null;
  actionDate: string;
}

/**
 * Domain model representing an employee leave application request.
 */
export interface LeaveRequest {
  id: number;
  uuid: string;
  employeeId: number;
  employeeName?: string | null;
  employeeCode?: string | null;
  leaveTypeId: number;
  leaveTypeName?: string | null;
  startDate: string;
  endDate: string;
  daysCount: number;
  status: string;
  reason: string;
  approvals: LeaveApproval[];
  createdAt: string;
}

/**
 * Domain model representing an employee's annual leave balance quota.
 */
export interface LeaveBalance {
  id: number;
  employeeId: number;
  leaveTypeId: number;
  leaveTypeName: string;
  leaveTypeCode: string;
  year: number;
  allocatedDays: number;
  usedDays: number;
  pendingDays: number;
  availableDays: number;
}

/**
 * Domain model representing a team calendar schedule item.
 */
export interface LeaveCalendarItem {
  leaveRequestId: number;
  employeeId: number;
  employeeName: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  status: string;
}

/**
 * Query parameters for fetching leave requests.
 */
export interface LeaveQueryParams {
  pageNumber?: number;
  pageSize?: number;
  employeeId?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Parameters for applying for leave.
 */
export interface ApplyLeaveParams {
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
}

/**
 * Parameters for creating/updating a leave policy type.
 */
export interface SaveLeaveTypeParams {
  id?: number;
  companyId?: number;
  name: string;
  code: string;
  annualQuota: number;
  requiresHrApproval: boolean;
  allowNegativeBalance: boolean;
  description?: string | null;
}
