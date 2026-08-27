using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Reports.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.Queries.GetPayrollReport;

/// <summary>
/// Handler for <see cref="GetPayrollReportQuery"/>.
/// </summary>
public class GetPayrollReportQueryHandler : IRequestHandler<GetPayrollReportQuery, ApiResponse<PayrollReportDto>>
{
    private readonly IAnalyticsRepository _analyticsRepository;
    private readonly ITenantResolutionService _tenantResolutionService;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetPayrollReportQueryHandler"/> class.
    /// </summary>
    public GetPayrollReportQueryHandler(
        IAnalyticsRepository analyticsRepository,
        ITenantResolutionService tenantResolutionService)
    {
        _analyticsRepository = analyticsRepository;
        _tenantResolutionService = tenantResolutionService;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PayrollReportDto>> Handle(GetPayrollReportQuery request, CancellationToken ct)
    {
        var targetCompanyId = await _tenantResolutionService.GetCurrentCompanyIdAsync(request.CompanyId, ct);
        var effectiveCompanyId = targetCompanyId ?? 1;

        var history = await _analyticsRepository.GetPayrollExpenseTrendAsync(effectiveCompanyId, ct);
        var historyDtos = history.Select(h => new PayrollExpenseItemDto(h.Period, h.GrossTotal, h.DeductionsTotal, h.NetTotal)).ToList();

        var report = new PayrollReportDto(historyDtos);
        return ApiResponse<PayrollReportDto>.Success(report);
    }
}
