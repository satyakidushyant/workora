using MediatR;
using Workora.Application.Features.Reports.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.Queries.GetPayrollReport;

/// <summary>
/// Query to generate payroll expense history analytics.
/// </summary>
public record GetPayrollReportQuery(int CompanyId) : IRequest<ApiResponse<PayrollReportDto>>;

/// <summary>
/// Handler for <see cref="GetPayrollReportQuery"/>.
/// </summary>
public class GetPayrollReportQueryHandler : IRequestHandler<GetPayrollReportQuery, ApiResponse<PayrollReportDto>>
{
    private readonly IAnalyticsRepository _analyticsRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetPayrollReportQueryHandler"/> class.
    /// </summary>
    public GetPayrollReportQueryHandler(IAnalyticsRepository analyticsRepository)
    {
        _analyticsRepository = analyticsRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PayrollReportDto>> Handle(GetPayrollReportQuery request, CancellationToken ct)
    {
        var history = await _analyticsRepository.GetPayrollExpenseTrendAsync(request.CompanyId, ct);
        var historyDtos = history.Select(h => new PayrollExpenseItemDto(h.Period, h.GrossTotal, h.DeductionsTotal, h.NetTotal)).ToList();

        var report = new PayrollReportDto(historyDtos);
        return ApiResponse<PayrollReportDto>.Success(report);
    }
}
