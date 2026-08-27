using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Reports.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.Queries.GetLeaveReport;

/// <summary>
/// Handler for <see cref="GetLeaveReportQuery"/>.
/// </summary>
public class GetLeaveReportQueryHandler : IRequestHandler<GetLeaveReportQuery, ApiResponse<LeaveReportDto>>
{
    private readonly IAnalyticsRepository _analyticsRepository;
    private readonly ITenantResolutionService _tenantResolutionService;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetLeaveReportQueryHandler"/> class.
    /// </summary>
    public GetLeaveReportQueryHandler(
        IAnalyticsRepository analyticsRepository,
        ITenantResolutionService tenantResolutionService)
    {
        _analyticsRepository = analyticsRepository;
        _tenantResolutionService = tenantResolutionService;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<LeaveReportDto>> Handle(GetLeaveReportQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);
        var effectiveCompanyId = targetCompanyId ?? 1;

        var year = request.Year ?? DateTime.UtcNow.Year;
        var utilization = await _analyticsRepository.GetLeaveUtilizationAsync(effectiveCompanyId, year, ct);

        var report = new LeaveReportDto(year, utilization);
        return ApiResponse<LeaveReportDto>.Success(report);
    }
}
