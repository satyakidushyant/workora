using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Dashboard.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.Queries.GetTodayAttendanceDashboard;

/// <summary>
/// Handler for <see cref="GetTodayAttendanceDashboardQuery"/>.
/// </summary>
public class GetTodayAttendanceDashboardQueryHandler : IRequestHandler<GetTodayAttendanceDashboardQuery, ApiResponse<TodayAttendanceDashboardDto>>
{
    private readonly IAnalyticsRepository _analyticsRepository;
    private readonly ITenantResolutionService _tenantResolutionService;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetTodayAttendanceDashboardQueryHandler"/> class.
    /// </summary>
    public GetTodayAttendanceDashboardQueryHandler(
        IAnalyticsRepository analyticsRepository,
        ITenantResolutionService tenantResolutionService)
    {
        _analyticsRepository = analyticsRepository;
        _tenantResolutionService = tenantResolutionService;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<TodayAttendanceDashboardDto>> Handle(GetTodayAttendanceDashboardQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);
        var effectiveCompanyId = targetCompanyId ?? 0;

        if (effectiveCompanyId <= 0 && targetCompanyId.HasValue)
        {
            return ApiResponse<TodayAttendanceDashboardDto>.Success(new TodayAttendanceDashboardDto(0, 0, 0, 0));
        }

        var metrics = await _analyticsRepository.GetTodayAttendanceMetricsAsync(effectiveCompanyId, ct);
        var dto = new TodayAttendanceDashboardDto(
            metrics.TotalPresent,
            metrics.OnTime,
            metrics.Late,
            metrics.CheckedOut);

        return ApiResponse<TodayAttendanceDashboardDto>.Success(dto);
    }
}
