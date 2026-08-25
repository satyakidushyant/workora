using MediatR;
using Workora.Application.Features.Compliance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Compliance.Queries.GetStatutorySummary;

/// <summary>
/// Query to calculate company-wide statutory deduction breakdown (PF, ESIC, PT, TDS) for a given month.
/// </summary>
public record GetStatutorySummaryQuery(int Month, int Year, int? CompanyId) : IRequest<ApiResponse<StatutorySummaryDto>>;

/// <summary>
/// Handler for <see cref="GetStatutorySummaryQuery"/>.
/// </summary>
public class GetStatutorySummaryQueryHandler : IRequestHandler<GetStatutorySummaryQuery, ApiResponse<StatutorySummaryDto>>
{
    private readonly IPayrollRepository _payrollRepository;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public GetStatutorySummaryQueryHandler(IPayrollRepository payrollRepository)
    {
        _payrollRepository = payrollRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<StatutorySummaryDto>> Handle(GetStatutorySummaryQuery request, CancellationToken ct)
    {
        var companyId = request.CompanyId ?? 1;
        var run = await _payrollRepository.GetByPeriodAsync(companyId, request.Month, request.Year, ct);

        if (run == null)
        {
            var empty = new StatutorySummaryDto(request.Month, request.Year, 0, 0, 0, 0, 0, 0, 0, 0);
            return ApiResponse<StatutorySummaryDto>.Success(empty);
        }

        var runDetails = await _payrollRepository.GetWithPayslipsAsync(run.Id, ct);
        var payslips = runDetails?.Payslips.ToList() ?? new();

        var empPf = payslips.SelectMany(p => p.Items).Where(i => i.ComponentName.Contains("Provident") || i.ComponentName.Contains("PF")).Sum(i => i.Amount);
        var employerPf = empPf; // 12% match
        var empEsic = payslips.SelectMany(p => p.Items).Where(i => i.ComponentName.Contains("ESIC")).Sum(i => i.Amount);
        var employerEsic = Math.Round(empEsic * 3.25m / 0.75m, 2); // 3.25% vs 0.75%
        var pt = payslips.SelectMany(p => p.Items).Where(i => i.ComponentName.Contains("Professional Tax") || i.ComponentName.Contains("PT")).Sum(i => i.Amount);
        var tds = payslips.SelectMany(p => p.Items).Where(i => i.ComponentName.Contains("Tax") || i.ComponentName.Contains("TDS")).Sum(i => i.Amount);
        var totalRemittance = empPf + employerPf + empEsic + employerEsic + pt + tds;

        var summary = new StatutorySummaryDto(
            request.Month,
            request.Year,
            payslips.Count,
            empPf,
            employerPf,
            empEsic,
            employerEsic,
            pt,
            tds,
            totalRemittance);

        return ApiResponse<StatutorySummaryDto>.Success(summary);
    }
}
