using MediatR;
using Workora.Application.Features.Dashboard.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.Queries.GetDashboardSummary;

/// <summary>
/// Query to retrieve executive top-level summary metrics.
/// </summary>
public record GetDashboardSummaryQuery(int CompanyId) : IRequest<ApiResponse<DashboardSummaryDto>>;

/// <summary>
/// Handler for <see cref="GetDashboardSummaryQuery"/>.
/// </summary>
public class GetDashboardSummaryQueryHandler : IRequestHandler<GetDashboardSummaryQuery, ApiResponse<DashboardSummaryDto>>
{
    private readonly IAnalyticsRepository _analyticsRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetDashboardSummaryQueryHandler"/> class.
    /// </summary>
    public GetDashboardSummaryQueryHandler(IAnalyticsRepository analyticsRepository)
    {
        _analyticsRepository = analyticsRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<DashboardSummaryDto>> Handle(GetDashboardSummaryQuery request, CancellationToken ct)
    {
        var summary = await _analyticsRepository.GetDashboardSummaryAsync(request.CompanyId, ct);
        var dto = new DashboardSummaryDto(
            summary.TotalEmployees,
            summary.ActiveEmployees,
            summary.OnLeaveToday,
            summary.PresentToday,
            summary.MonthlyPayrollCost);

        return ApiResponse<DashboardSummaryDto>.Success(dto);
    }
}
