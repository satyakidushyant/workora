using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Reports.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.Queries.GetHeadcountReport;

/// <summary>
/// Handler for <see cref="GetHeadcountReportQuery"/>.
/// </summary>
public class GetHeadcountReportQueryHandler : IRequestHandler<GetHeadcountReportQuery, ApiResponse<HeadcountReportDto>>
{
    private readonly IAnalyticsRepository _analyticsRepository;
    private readonly ITenantResolutionService _tenantResolutionService;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetHeadcountReportQueryHandler"/> class.
    /// </summary>
    public GetHeadcountReportQueryHandler(
        IAnalyticsRepository analyticsRepository,
        ITenantResolutionService tenantResolutionService)
    {
        _analyticsRepository = analyticsRepository;
        _tenantResolutionService = tenantResolutionService;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<HeadcountReportDto>> Handle(GetHeadcountReportQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);
        var effectiveCompanyId = targetCompanyId ?? 1;

        var summary = await _analyticsRepository.GetDashboardSummaryAsync(effectiveCompanyId, ct);
        var trend = await _analyticsRepository.GetHeadcountTrendAsync(effectiveCompanyId, ct);

        var trendDtos = trend.Select(t => new HeadcountTrendItemDto(t.MonthYear, t.Headcount, t.Joiners, t.Leavers)).ToList();
        var report = new HeadcountReportDto(summary.TotalEmployees, summary.ActiveEmployees, trendDtos);

        return ApiResponse<HeadcountReportDto>.Success(report);
    }
}
