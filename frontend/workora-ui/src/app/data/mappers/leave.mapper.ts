import {
  LeaveTypeDto,
  LeaveRequestDto,
  LeaveApprovalDto,
  LeaveBalanceDto,
  LeaveCalendarItemDto
} from '../dtos/leave.dto';
import {
  LeaveType,
  LeaveRequest,
  LeaveApproval,
  LeaveBalance,
  LeaveCalendarItem
} from '../../domain/models/leave.model';

export class LeaveMapper {
  static fromTypeDto(dto: LeaveTypeDto): LeaveType {
    return {
      id: dto.id,
      uuid: dto.uuid,
      companyId: dto.companyId,
      name: dto.name,
      code: dto.code,
      annualQuota: dto.annualQuota,
      requiresHrApproval: dto.requiresHrApproval,
      allowNegativeBalance: dto.allowNegativeBalance,
      description: dto.description,
      isActive: dto.isActive,
      createdAt: dto.createdAt
    };
  }

  static fromApprovalDto(dto: LeaveApprovalDto): LeaveApproval {
    return {
      id: dto.id,
      leaveRequestId: dto.leaveRequestId,
      approverEmployeeId: dto.approverEmployeeId,
      approverRole: dto.approverRole,
      status: dto.status,
      comments: dto.comments,
      actionDate: dto.actionDate
    };
  }

  static fromRequestDto(dto: LeaveRequestDto): LeaveRequest {
    return {
      id: dto.id,
      uuid: dto.uuid,
      employeeId: dto.employeeId,
      employeeName: dto.employeeName,
      employeeCode: dto.employeeCode,
      leaveTypeId: dto.leaveTypeId,
      leaveTypeName: dto.leaveTypeName,
      startDate: dto.startDate,
      endDate: dto.endDate,
      daysCount: dto.daysCount,
      status: dto.status,
      reason: dto.reason,
      approvals: (dto.approvals || []).map(a => this.fromApprovalDto(a)),
      createdAt: dto.createdAt
    };
  }

  static fromBalanceDto(dto: LeaveBalanceDto): LeaveBalance {
    return {
      id: dto.id,
      employeeId: dto.employeeId,
      leaveTypeId: dto.leaveTypeId,
      leaveTypeName: dto.leaveTypeName,
      leaveTypeCode: dto.leaveTypeCode,
      year: dto.year,
      allocatedDays: dto.allocatedDays,
      usedDays: dto.usedDays,
      pendingDays: dto.pendingDays,
      availableDays: dto.availableDays
    };
  }

  static fromCalendarItemDto(dto: LeaveCalendarItemDto): LeaveCalendarItem {
    return {
      leaveRequestId: dto.leaveRequestId,
      employeeId: dto.employeeId,
      employeeName: dto.employeeName,
      leaveTypeName: dto.leaveTypeName,
      startDate: dto.startDate,
      endDate: dto.endDate,
      daysCount: dto.daysCount,
      status: dto.status
    };
  }
}
