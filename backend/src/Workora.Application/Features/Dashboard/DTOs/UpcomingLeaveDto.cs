using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.DTOs;

/// <summary>
/// Upcoming leave entry on dashboard calendar.
/// </summary>
public record UpcomingLeaveDto(
    int Id,
    int EmployeeId,
    string EmployeeName,
    string LeaveTypeName,
    DateOnly StartDate,
    DateOnly EndDate,
    decimal TotalDays);
