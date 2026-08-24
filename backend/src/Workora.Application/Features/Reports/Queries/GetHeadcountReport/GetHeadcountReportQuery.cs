using MediatR;
using Workora.Application.Features.Reports.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.Queries.GetHeadcountReport;

/// <summary>
/// Query to generate headcount growth and turnover analytics.
/// </summary>
public record GetHeadcountReportQuery(int CompanyId) : IRequest<ApiResponse<HeadcountReportDto>>;

/// <summary>
/// Handler for <see cref="GetHeadcountReportQuery"/>.
/// </summary>
public class GetHeadcountReportQueryHandler : IRequestHandler<GetHeadcountReportQuery, ApiResponse<HeadcountReportDto>>
{
    private readonly IAnalyticsRepository _analyticsRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetHeadcountReportQueryHandler"/> class.
    /// </summary>
    public GetHeadcountReportQueryHandler(IAnalyticsRepository analyticsRepository)
    {
        _analyticsRepository = analyticsRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<HeadcountReportDto>> Handle(GetHeadcountReportQuery request, CancellationToken ct)
    {
        var summary = await _analyticsRepository.GetDashboardSummaryAsync(request.CompanyId, ct);
        var trend = await _analyticsRepository.GetHeadcountTrendAsync(request.CompanyId, ct);

        var trendDtos = trend.Select(t => new HeadcountTrendItemDto(t.MonthYear, t.Headcount, t.Joiners, t.Leavers)).ToList();
        var report = new HeadcountReportDto(summary.TotalEmployees, summary.ActiveEmployees, trendDtos);

        return ApiResponse<HeadcountReportDto>.Success(report);
    }
}
