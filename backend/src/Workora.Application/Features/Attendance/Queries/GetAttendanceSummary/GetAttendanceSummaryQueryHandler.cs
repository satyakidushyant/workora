using MediatR;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Queries.GetAttendanceSummary;

/// <summary>
/// Handler for <see cref="GetAttendanceSummaryQuery"/>.
/// </summary>
public class GetAttendanceSummaryQueryHandler : IRequestHandler<GetAttendanceSummaryQuery, ApiResponse<AttendanceSummaryDto>>
{
    private readonly IAttendanceRepository _attendanceRepository;
    private readonly IEmployeeRepository _employeeRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetAttendanceSummaryQueryHandler"/> class.
    /// </summary>
    public GetAttendanceSummaryQueryHandler(
        IAttendanceRepository attendanceRepository,
        IEmployeeRepository employeeRepository)
    {
        _attendanceRepository = attendanceRepository;
        _employeeRepository = employeeRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<AttendanceSummaryDto>> Handle(GetAttendanceSummaryQuery request, CancellationToken ct)
    {
        var employee = await _employeeRepository.GetByIdAsync(request.EmployeeId, ct);
        if (employee == null)
        {
            return ApiResponse<AttendanceSummaryDto>.Fail("Employee not found.");
        }

        var startDate = new DateOnly(request.Year, request.Month, 1);
        var daysInMonth = DateTime.DaysInMonth(request.Year, request.Month);
        var endDate = new DateOnly(request.Year, request.Month, daysInMonth);

        var records = await _attendanceRepository.GetHistoryAsync(request.EmployeeId, startDate, endDate, ct);

        var presentDays = records.Count(r => r.Status == AttendanceStatus.Present);
        var lateDays = records.Count(r => r.Status == AttendanceStatus.Late);
        var halfDays = records.Count(r => r.Status == AttendanceStatus.HalfDay);
        var absentDays = records.Count(r => r.Status == AttendanceStatus.Absent);
        var leaveDays = records.Count(r => r.Status == AttendanceStatus.OnLeave);
        var holidaysCount = records.Count(r => r.Status == AttendanceStatus.Holiday);
        var totalHours = records.Sum(r => r.WorkingHours);
        var totalOvertime = records.Sum(r => r.OvertimeHours);

        var summary = new AttendanceSummaryDto(
            request.EmployeeId,
            request.Month,
            request.Year,
            daysInMonth,
            presentDays,
            lateDays,
            halfDays,
            absentDays,
            leaveDays,
            holidaysCount,
            totalHours,
            totalOvertime);

        return ApiResponse<AttendanceSummaryDto>.Success(summary);
    }
}
