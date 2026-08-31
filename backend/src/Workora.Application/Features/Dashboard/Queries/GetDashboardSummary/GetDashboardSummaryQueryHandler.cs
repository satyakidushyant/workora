using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Dashboard.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.Queries.GetDashboardSummary;

/// <summary>
/// Handler for <see cref="GetDashboardSummaryQuery"/> that computes executive HRMS dashboard summary statistics.
/// </summary>
public class GetDashboardSummaryQueryHandler : IRequestHandler<GetDashboardSummaryQuery, ApiResponse<DashboardSummaryDto>>
{
    private readonly IAnalyticsRepository _analyticsRepository;
    private readonly ITenantResolutionService _tenantResolutionService;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetDashboardSummaryQueryHandler"/> class.
    /// </summary>
    /// <param name="analyticsRepository">The analytics repository.</param>
    /// <param name="tenantResolutionService">The tenant resolution service.</param>
    public GetDashboardSummaryQueryHandler(
        IAnalyticsRepository analyticsRepository,
        ITenantResolutionService tenantResolutionService)
    {
        _analyticsRepository = analyticsRepository;
        _tenantResolutionService = tenantResolutionService;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<DashboardSummaryDto>> Handle(GetDashboardSummaryQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);
        var effectiveCompanyId = targetCompanyId ?? 0;

        if (effectiveCompanyId <= 0 && targetCompanyId.HasValue)
        {
            return ApiResponse<DashboardSummaryDto>.Success(new DashboardSummaryDto(0, 0, 0, 0, 0));
        }

        var summary = await _analyticsRepository.GetDashboardSummaryAsync(effectiveCompanyId, ct);
        var dto = new DashboardSummaryDto(
            summary.TotalEmployees,
            summary.ActiveEmployees,
            summary.OnLeaveToday,
            summary.PresentToday,
            summary.MonthlyPayrollCost);

        return ApiResponse<DashboardSummaryDto>.Success(dto);
    }
}
