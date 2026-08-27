using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Reports.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.Queries.GetAttendanceReport;

/// <summary>
/// Handler for <see cref="GetAttendanceReportQuery"/>.
/// </summary>
public class GetAttendanceReportQueryHandler : IRequestHandler<GetAttendanceReportQuery, ApiResponse<AttendanceReportDto>>
{
    private readonly IAnalyticsRepository _analyticsRepository;
    private readonly ITenantResolutionService _tenantResolutionService;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetAttendanceReportQueryHandler"/> class.
    /// </summary>
    public GetAttendanceReportQueryHandler(
        IAnalyticsRepository analyticsRepository,
        ITenantResolutionService tenantResolutionService)
    {
        _analyticsRepository = analyticsRepository;
        _tenantResolutionService = tenantResolutionService;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<AttendanceReportDto>> Handle(GetAttendanceReportQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);
        var effectiveCompanyId = targetCompanyId ?? 1;

        var metrics = await _analyticsRepository.GetTodayAttendanceMetricsAsync(effectiveCompanyId, ct);
        var report = new AttendanceReportDto(metrics.TotalPresent, metrics.OnTime, metrics.Late, metrics.CheckedOut);
        return ApiResponse<AttendanceReportDto>.Success(report);
    }
}
