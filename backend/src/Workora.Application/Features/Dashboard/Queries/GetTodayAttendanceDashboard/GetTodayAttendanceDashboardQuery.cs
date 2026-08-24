using MediatR;
using Workora.Application.Features.Dashboard.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.Queries.GetTodayAttendanceDashboard;

/// <summary>
/// Query to retrieve today's real-time attendance KPIs for the dashboard.
/// </summary>
public record GetTodayAttendanceDashboardQuery(int CompanyId) : IRequest<ApiResponse<TodayAttendanceDashboardDto>>;

/// <summary>
/// Handler for <see cref="GetTodayAttendanceDashboardQuery"/>.
/// </summary>
public class GetTodayAttendanceDashboardQueryHandler : IRequestHandler<GetTodayAttendanceDashboardQuery, ApiResponse<TodayAttendanceDashboardDto>>
{
    private readonly IAnalyticsRepository _analyticsRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetTodayAttendanceDashboardQueryHandler"/> class.
    /// </summary>
    public GetTodayAttendanceDashboardQueryHandler(IAnalyticsRepository analyticsRepository)
    {
        _analyticsRepository = analyticsRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<TodayAttendanceDashboardDto>> Handle(GetTodayAttendanceDashboardQuery request, CancellationToken ct)
    {
        var metrics = await _analyticsRepository.GetTodayAttendanceMetricsAsync(request.CompanyId, ct);
        var dto = new TodayAttendanceDashboardDto(
            metrics.TotalPresent,
            metrics.OnTime,
            metrics.Late,
            metrics.CheckedOut);

        return ApiResponse<TodayAttendanceDashboardDto>.Success(dto);
    }
}
