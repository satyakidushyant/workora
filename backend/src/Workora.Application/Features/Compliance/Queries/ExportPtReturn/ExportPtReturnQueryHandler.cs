using System.Text;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using MediatR;
using Workora.Application.Features.Compliance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Compliance.Queries.ExportPtReturn;

/// <summary>
/// Handler for <see cref="ExportPtReturnQuery"/>.
/// </summary>
public class ExportPtReturnQueryHandler : IRequestHandler<ExportPtReturnQuery, ApiResponse<StatutoryExportFileDto>>
{
    private readonly IPayrollRepository _payrollRepository;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ExportPtReturnQueryHandler(IPayrollRepository payrollRepository)
    {
        _payrollRepository = payrollRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<StatutoryExportFileDto>> Handle(ExportPtReturnQuery request, CancellationToken ct)
    {
        var companyId = request.CompanyId ?? 1;
        var run = await _payrollRepository.GetByPeriodAsync(companyId, request.Month, request.Year, ct);
        var runDetails = run != null ? await _payrollRepository.GetWithPayslipsAsync(run.Id, ct) : null;
        var payslips = runDetails?.Payslips.Where(p => p.Items.Any(i => (i.ComponentName.Contains("Professional Tax") || i.ComponentName.Contains("PT")) && i.Amount > 0)).ToList() ?? new();

        var sb = new StringBuilder();
        sb.AppendLine("EMPLOYEE_CODE,EMPLOYEE_NAME,GROSS_SALARY,PT_DEDUCTION");
        foreach (var p in payslips)
        {
            var code = p.EmployeeCode;
            var name = !string.IsNullOrWhiteSpace(p.EmployeeName) ? p.EmployeeName : "Employee";
            var ptAmount = p.Items.FirstOrDefault(i => i.ComponentName.Contains("Professional Tax") || i.ComponentName.Contains("PT"))?.Amount ?? 200m;
            sb.AppendLine($"{code},\"{name}\",{p.GrossSalary:F2},{ptAmount:F2}");
        }

        var bytes = Encoding.UTF8.GetBytes(sb.ToString());
        var base64 = Convert.ToBase64String(bytes);
        var exportDto = new StatutoryExportFileDto($"PT_Return_{request.Year}_{request.Month:D2}.csv", "text/csv", base64);

        return ApiResponse<StatutoryExportFileDto>.Success(exportDto, ResponseMessage.PtReturnGenerated.GetDescription());
    }
}
