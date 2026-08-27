using System.Text;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Features.Compliance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Compliance.Queries.ExportEsicMonthlyReturn;

/// <summary>
/// Handler for <see cref="ExportEsicMonthlyReturnQuery"/>.
/// </summary>
public class ExportEsicMonthlyReturnQueryHandler : IRequestHandler<ExportEsicMonthlyReturnQuery, ApiResponse<StatutoryExportFileDto>>
{
    private readonly IPayrollRepository _payrollRepository;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ExportEsicMonthlyReturnQueryHandler(IPayrollRepository payrollRepository)
    {
        _payrollRepository = payrollRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<StatutoryExportFileDto>> Handle(ExportEsicMonthlyReturnQuery request, CancellationToken ct)
    {
        var companyId = request.CompanyId ?? 1;
        var run = await _payrollRepository.GetByPeriodAsync(companyId, request.Month, request.Year, ct);
        var runDetails = run != null ? await _payrollRepository.GetWithPayslipsAsync(run.Id, ct) : null;
        var payslips = runDetails?.Payslips.Where(p => p.Items.Any(i => i.ComponentName.Contains("ESIC") && i.Amount > 0)).ToList() ?? new();

        var sb = new StringBuilder();
        sb.AppendLine("IP_NUMBER,IP_NAME,NO_OF_DAYS,TOTAL_MONTHLY_WAGES,REASON_CODE,LAST_WORKING_DAY");
        foreach (var p in payslips)
        {
            var ipNo = "3198765432";
            var name = !string.IsNullOrWhiteSpace(p.EmployeeName) ? p.EmployeeName : "Employee";
            sb.AppendLine($"{ipNo},\"{name}\",30,{p.GrossSalary:F2},0,");
        }

        var bytes = Encoding.UTF8.GetBytes(sb.ToString());
        var base64 = Convert.ToBase64String(bytes);
        var exportDto = new StatutoryExportFileDto($"ESIC_Monthly_{request.Year}_{request.Month:D2}.csv", "text/csv", base64);

        return ApiResponse<StatutoryExportFileDto>.Success(exportDto, ResponseMessage.EsicReturnGenerated.GetDescription());
    }
}
