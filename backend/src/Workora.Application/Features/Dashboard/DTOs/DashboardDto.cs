namespace Workora.Application.Features.Dashboard.DTOs;

/// <summary>
/// Executive aggregate dashboard metrics.
/// </summary>
public record DashboardSummaryDto(
    int TotalEmployees,
    int ActiveEmployees,
    int OnLeaveToday,
    int PresentToday,
    decimal MonthlyPayrollCost);

/// <summary>
/// Headcount count per department.
/// </summary>
public record DepartmentHeadcountDto(
    string DepartmentName,
    int Count);

/// <summary>
/// Recent activity feed item.
/// </summary>
public record RecentActivityDto(
    int Id,
    string? ActorEmail,
    string Action,
    string EntityName,
    string? EntityId,
    DateTimeOffset Timestamp);

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

/// <summary>
/// Real-time today attendance metrics.
/// </summary>
public record TodayAttendanceDashboardDto(
    int TotalPresent,
    int OnTime,
    int Late,
    int CheckedOut);
