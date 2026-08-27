using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

using Workora.Application.Features.Attendance.DTOs;
namespace Workora.Application.Features.Attendance.Queries.GetLiveAttendanceStatus;

/// <summary>
/// Handler for <see cref="GetLiveAttendanceStatusQuery"/>.
/// </summary>
public class GetLiveAttendanceStatusQueryHandler : IRequestHandler<GetLiveAttendanceStatusQuery, ApiResponse<LiveAttendanceStatusDto>>
{
    private readonly IGenericRepository<AttendanceRecord> _attendanceRepository;
    private readonly IGenericRepository<Employee> _employeeRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetLiveAttendanceStatusQueryHandler"/> class.
    /// </summary>
    public GetLiveAttendanceStatusQueryHandler(
        IGenericRepository<AttendanceRecord> attendanceRepository,
        IGenericRepository<Employee> employeeRepository)
    {
        _attendanceRepository = attendanceRepository;
        _employeeRepository = employeeRepository;
    }

    /// <summary>
    /// Handles computing real-time live attendance stats.
    /// </summary>
    public Task<ApiResponse<LiveAttendanceStatusDto>> Handle(GetLiveAttendanceStatusQuery request, CancellationToken cancellationToken)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var totalHeadcount = _employeeRepository.GetQueryable().Count(e => e.IsActive);
        var todayRecords = _attendanceRepository.GetQueryable().Where(a => a.AttendanceDate == today).ToList();

        var dto = new LiveAttendanceStatusDto
        {
            PresentCount = todayRecords.Count(a => a.Status == AttendanceStatus.Present),
            AbsentCount = todayRecords.Count(a => a.Status == AttendanceStatus.Absent),
            LateCount = todayRecords.Count(a => a.Status == AttendanceStatus.Late),
            OnLeaveCount = todayRecords.Count(a => a.Status == AttendanceStatus.OnLeave),
            TotalHeadcount = totalHeadcount
        };

        return Task.FromResult(ApiResponse<LiveAttendanceStatusDto>.Success(dto, "Live attendance status retrieved successfully."));
    }
}
