using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.DTOs;

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
