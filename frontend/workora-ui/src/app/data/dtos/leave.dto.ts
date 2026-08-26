export interface LeaveTypeDto {
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

export interface LeaveApprovalDto {
  id: number;
  leaveRequestId: number;
  approverEmployeeId: number;
  approverRole: string;
  status: string;
  comments?: string | null;
  actionDate: string;
}

export interface LeaveRequestDto {
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
  approvals: LeaveApprovalDto[];
  createdAt: string;
}

export interface LeaveBalanceDto {
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

export interface LeaveCalendarItemDto {
  leaveRequestId: number;
  employeeId: number;
  employeeName: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  status: string;
}

export interface ApplyLeaveRequestDto {
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
}

export interface CreateLeaveTypeRequestDto {
  companyId: number;
  name: string;
  code: string;
  annualQuota: number;
  requiresHrApproval: boolean;
  allowNegativeBalance: boolean;
  description?: string | null;
}

export interface UpdateLeaveTypeRequestDto {
  name: string;
  code: string;
  annualQuota: number;
  requiresHrApproval: boolean;
  allowNegativeBalance: boolean;
  description?: string | null;
}

export interface ProcessLeaveRequestDto {
  comments?: string | null;
}
