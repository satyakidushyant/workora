using Workora.Domain.Enums;

namespace Workora.Application.Features.Leave.DTOs;

/// <summary>
/// Data transfer object representing a leave type policy.
/// </summary>
public class LeaveTypeDto
{
    public int Id { get; set; }
    public Guid Uuid { get; set; }
    public int CompanyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public decimal AnnualQuota { get; set; }
    public bool RequiresHrApproval { get; set; }
    public bool AllowNegativeBalance { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}

/// <summary>
/// Data transfer object for a leave request.
/// </summary>
public class LeaveRequestDto
{
    public int Id { get; set; }
    public Guid Uuid { get; set; }
    public int EmployeeId { get; set; }
    public string? EmployeeName { get; set; }
    public string? EmployeeCode { get; set; }
    public int LeaveTypeId { get; set; }
    public string? LeaveTypeName { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public decimal DaysCount { get; set; }
    public LeaveRequestStatus Status { get; set; }
    public string Reason { get; set; } = string.Empty;
    public IReadOnlyList<LeaveApprovalDto> Approvals { get; set; } = new List<LeaveApprovalDto>();
    public DateTimeOffset CreatedAt { get; set; }
}

/// <summary>
/// Data transfer object for a leave approval record.
/// </summary>
public class LeaveApprovalDto
{
    public int Id { get; set; }
    public int LeaveRequestId { get; set; }
    public int ApproverEmployeeId { get; set; }
    public string ApproverRole { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string? Comments { get; set; }
    public DateTimeOffset ActionDate { get; set; }
}

/// <summary>
/// Data transfer object for an employee's leave balance.
/// </summary>
public class LeaveBalanceDto
{
    public int Id { get; set; }
    public int EmployeeId { get; set; }
    public int LeaveTypeId { get; set; }
    public string LeaveTypeName { get; set; } = string.Empty;
    public string LeaveTypeCode { get; set; } = string.Empty;
    public int Year { get; set; }
    public decimal AllocatedDays { get; set; }
    public decimal UsedDays { get; set; }
    public decimal PendingDays { get; set; }
    public decimal AvailableDays { get; set; }

    public LeaveBalanceDto() { }

    public LeaveBalanceDto(
        int id,
        int employeeId,
        int leaveTypeId,
        string leaveTypeName,
        string leaveTypeCode,
        int year,
        decimal allocatedDays,
        decimal usedDays,
        decimal pendingDays,
        decimal availableDays)
    {
        Id = id;
        EmployeeId = employeeId;
        LeaveTypeId = leaveTypeId;
        LeaveTypeName = leaveTypeName;
        LeaveTypeCode = leaveTypeCode;
        Year = year;
        AllocatedDays = allocatedDays;
        UsedDays = usedDays;
        PendingDays = pendingDays;
        AvailableDays = availableDays;
    }
}

/// <summary>
/// Calendar item DTO for department/company-wide leave schedule.
/// </summary>
public class LeaveCalendarItemDto
{
    public int LeaveRequestId { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string LeaveTypeName { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public decimal DaysCount { get; set; }
    public LeaveRequestStatus Status { get; set; }

    public LeaveCalendarItemDto() { }

    public LeaveCalendarItemDto(
        int leaveRequestId,
        int employeeId,
        string employeeName,
        string leaveTypeName,
        DateOnly startDate,
        DateOnly endDate,
        decimal daysCount,
        LeaveRequestStatus status)
    {
        LeaveRequestId = leaveRequestId;
        EmployeeId = employeeId;
        EmployeeName = employeeName;
        LeaveTypeName = leaveTypeName;
        StartDate = startDate;
        EndDate = endDate;
        DaysCount = daysCount;
        Status = status;
    }
}

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
