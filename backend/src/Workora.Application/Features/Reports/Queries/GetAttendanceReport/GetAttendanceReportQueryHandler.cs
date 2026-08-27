using MediatR;
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

    /// <summary>
    /// Initializes a new instance of the <see cref="GetAttendanceReportQueryHandler"/> class.
    /// </summary>
    public GetAttendanceReportQueryHandler(IAnalyticsRepository analyticsRepository)
    {
        _analyticsRepository = analyticsRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<AttendanceReportDto>> Handle(GetAttendanceReportQuery request, CancellationToken ct)
    {
        var metrics = await _analyticsRepository.GetTodayAttendanceMetricsAsync(request.CompanyId, ct);
        var report = new AttendanceReportDto(metrics.TotalPresent, metrics.OnTime, metrics.Late, metrics.CheckedOut);
        return ApiResponse<AttendanceReportDto>.Success(report);
    }
}
