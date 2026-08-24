using Workora.Domain.Enums;

namespace Workora.Application.Features.Leave.DTOs;

/// <summary>
/// Data transfer object representing a leave type policy.
/// </summary>
public record LeaveTypeDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    string Name,
    string Code,
    decimal AnnualQuota,
    bool RequiresHrApproval,
    bool AllowNegativeBalance,
    string? Description,
    bool IsActive,
    DateTimeOffset CreatedAt);

/// <summary>
/// Data transfer object for a leave request.
/// </summary>
public record LeaveRequestDto(
    int Id,
    Guid Uuid,
    int EmployeeId,
    string? EmployeeName,
    string? EmployeeCode,
    int LeaveTypeId,
    string? LeaveTypeName,
    DateOnly StartDate,
    DateOnly EndDate,
    decimal DaysCount,
    LeaveRequestStatus Status,
    string Reason,
    IReadOnlyList<LeaveApprovalDto> Approvals,
    DateTimeOffset CreatedAt);

/// <summary>
/// Data transfer object for a leave approval record.
/// </summary>
public record LeaveApprovalDto(
    int Id,
    int LeaveRequestId,
    int ApproverEmployeeId,
    string ApproverRole,
    string Status,
    string? Comments,
    DateTimeOffset ActionDate);

/// <summary>
/// Data transfer object for an employee's leave balance.
/// </summary>
public record LeaveBalanceDto(
    int Id,
    int EmployeeId,
    int LeaveTypeId,
    string LeaveTypeName,
    string LeaveTypeCode,
    int Year,
    decimal AllocatedDays,
    decimal UsedDays,
    decimal PendingDays,
    decimal AvailableDays);

/// <summary>
/// Calendar item DTO for department/company-wide leave schedule.
/// </summary>
public record LeaveCalendarItemDto(
    int LeaveRequestId,
    int EmployeeId,
    string EmployeeName,
    string LeaveTypeName,
    DateOnly StartDate,
    DateOnly EndDate,
    decimal DaysCount,
    LeaveRequestStatus Status);

/// <summary>
/// Request payload for submitting a leave application.
/// </summary>
public record ApplyLeaveRequestDto(
    int LeaveTypeId,
    DateOnly StartDate,
    DateOnly EndDate,
    decimal DaysCount,
    string Reason);

/// <summary>
/// Request payload for creating a leave type.
/// </summary>
public record CreateLeaveTypeRequestDto(
    int CompanyId,
    string Name,
    string Code,
    decimal AnnualQuota,
    bool RequiresHrApproval,
    bool AllowNegativeBalance,
    string? Description);

/// <summary>
/// Request payload for updating a leave type.
/// </summary>
public record UpdateLeaveTypeRequestDto(
    string Name,
    string Code,
    decimal AnnualQuota,
    bool RequiresHrApproval,
    bool AllowNegativeBalance,
    string? Description);

/// <summary>
/// Request payload for approving or rejecting a leave request.
/// </summary>
public record ProcessLeaveRequestDto(
    string? Comments);
