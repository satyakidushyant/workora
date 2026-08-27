using MediatR;
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

    /// <summary>
    /// Initializes a new instance of the <see cref="GetLeaveReportQueryHandler"/> class.
    /// </summary>
    public GetLeaveReportQueryHandler(IAnalyticsRepository analyticsRepository)
    {
        _analyticsRepository = analyticsRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<LeaveReportDto>> Handle(GetLeaveReportQuery request, CancellationToken ct)
    {
        var year = request.Year ?? DateTime.UtcNow.Year;
        var utilization = await _analyticsRepository.GetLeaveUtilizationAsync(request.CompanyId, year, ct);

        var report = new LeaveReportDto(year, utilization);
        return ApiResponse<LeaveReportDto>.Success(report);
    }
}
