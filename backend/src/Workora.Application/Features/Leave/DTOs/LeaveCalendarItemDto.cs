using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.DTOs;

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
