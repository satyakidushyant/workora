using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Application.Features.Attendance.DTOs;

namespace Workora.Application.Features.Attendance.Queries.GetLiveAttendanceStatus;

/// <summary>
/// Handler for <see cref="GetLiveAttendanceStatusQuery"/>.
/// Computes live headcount and attendance strictly scoped to the tenant's company.
/// </summary>
public class GetLiveAttendanceStatusQueryHandler : IRequestHandler<GetLiveAttendanceStatusQuery, ApiResponse<LiveAttendanceStatusDto>>
{
    private readonly IGenericRepository<AttendanceRecord> _attendanceRepository;
    private readonly IGenericRepository<Employee> _employeeRepository;
    private readonly ITenantResolutionService _tenantResolutionService;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetLiveAttendanceStatusQueryHandler"/> class.
    /// </summary>
    public GetLiveAttendanceStatusQueryHandler(
        IGenericRepository<AttendanceRecord> attendanceRepository,
        IGenericRepository<Employee> employeeRepository,
        ITenantResolutionService tenantResolutionService)
    {
        _attendanceRepository = attendanceRepository;
        _employeeRepository = employeeRepository;
        _tenantResolutionService = tenantResolutionService;
    }

    /// <summary>
    /// Handles computing real-time live attendance stats.
    /// </summary>
    public async Task<ApiResponse<LiveAttendanceStatusDto>> Handle(GetLiveAttendanceStatusQuery request, CancellationToken cancellationToken)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, cancellationToken);
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var employeeQuery = _employeeRepository.GetQueryable().Where(e => e.IsActive);
        if (targetCompanyId.HasValue)
        {
            var cid = targetCompanyId.Value;
            employeeQuery = employeeQuery.Where(e => (e.Department != null && e.Department.CompanyId == cid) || (e.Branch != null && e.Branch.CompanyId == cid));
        }

        var totalHeadcount = employeeQuery.Count();

        var attendanceQuery = _attendanceRepository.GetQueryable().Where(a => a.AttendanceDate == today);
        if (targetCompanyId.HasValue)
        {
            attendanceQuery = attendanceQuery.Where(a => employeeQuery.Any(e => e.Id == a.EmployeeId));
        }

        var todayRecords = attendanceQuery.ToList();

        var dto = new LiveAttendanceStatusDto
        {
            PresentCount = todayRecords.Count(a => a.Status == AttendanceStatus.Present),
            AbsentCount = todayRecords.Count(a => a.Status == AttendanceStatus.Absent),
            LateCount = todayRecords.Count(a => a.Status == AttendanceStatus.Late),
            OnLeaveCount = todayRecords.Count(a => a.Status == AttendanceStatus.OnLeave),
            TotalHeadcount = totalHeadcount
        };

        return ApiResponse<LiveAttendanceStatusDto>.Success(dto, ResponseMessage.LiveAttendanceStatusRetrieved.GetDescription());
    }
}
