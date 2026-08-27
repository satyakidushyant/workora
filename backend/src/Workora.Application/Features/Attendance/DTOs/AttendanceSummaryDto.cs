using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.DTOs;

/// <summary>
/// Monthly attendance summary stats DTO.
/// </summary>
public class AttendanceSummaryDto
{
    public int EmployeeId { get; set; }
    public int Month { get; set; }
    public int Year { get; set; }
    public int TotalWorkingDays { get; set; }
    public int PresentDays { get; set; }
    public int LateDays { get; set; }
    public int HalfDays { get; set; }
    public int AbsentDays { get; set; }
    public int LeaveDays { get; set; }
    public int HolidaysCount { get; set; }
    public decimal TotalHoursWorked { get; set; }
    public decimal TotalOvertimeHours { get; set; }

    public AttendanceSummaryDto() { }

    public AttendanceSummaryDto(
        int employeeId,
        int month,
        int year,
        int totalWorkingDays,
        int presentDays,
        int lateDays,
        int halfDays,
        int absentDays,
        int leaveDays,
        int holidaysCount,
        decimal totalHoursWorked,
        decimal totalOvertimeHours)
    {
        EmployeeId = employeeId;
        Month = month;
        Year = year;
        TotalWorkingDays = totalWorkingDays;
        PresentDays = presentDays;
        LateDays = lateDays;
        HalfDays = halfDays;
        AbsentDays = absentDays;
        LeaveDays = leaveDays;
        HolidaysCount = holidaysCount;
        TotalHoursWorked = totalHoursWorked;
        TotalOvertimeHours = totalOvertimeHours;
    }
}
