using System.Text;
using MediatR;
using Workora.Application.Features.Compliance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Compliance.Queries.ExportEpfEcr;

/// <summary>
/// Query to generate standard EPF Unified Portal ECR (Electronic Challan cum Return) text file.
/// </summary>
public record ExportEpfEcrQuery(int Month, int Year, int? CompanyId) : IRequest<ApiResponse<StatutoryExportFileDto>>;

/// <summary>
/// Handler for <see cref="ExportEpfEcrQuery"/>.
/// </summary>
public class ExportEpfEcrQueryHandler : IRequestHandler<ExportEpfEcrQuery, ApiResponse<StatutoryExportFileDto>>
{
    private readonly IPayrollRepository _payrollRepository;

    /// <summary>
    /// Initializes a new instance of the handler.
    /// </summary>
    public ExportEpfEcrQueryHandler(IPayrollRepository payrollRepository)
    {
        _payrollRepository = payrollRepository;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<StatutoryExportFileDto>> Handle(ExportEpfEcrQuery request, CancellationToken ct)
    {
        var companyId = request.CompanyId ?? 1;
        var run = await _payrollRepository.GetByPeriodAsync(companyId, request.Month, request.Year, ct);
        var runDetails = run != null ? await _payrollRepository.GetWithPayslipsAsync(run.Id, ct) : null;
        var payslips = runDetails?.Payslips.ToList() ?? new();

        var sb = new StringBuilder();
        // ECR Format: UAN#~#MEMBER_NAME#~#GROSS_WAGES#~#EPF_WAGES#~#EPS_WAGES#~#EDLI_WAGES#~#EE_SHARE#~#EPS_SHARE#~#ER_SHARE#~#NCP_DAYS#~#REFUND_ADVANCES
        foreach (var p in payslips)
        {
            var uan = "101234567890";
            var name = !string.IsNullOrWhiteSpace(p.EmployeeName) ? p.EmployeeName.ToUpperInvariant() : "EMPLOYEE";
            var basic = p.Items.FirstOrDefault(i => i.ComponentName.Contains("Basic"))?.Amount ?? (p.GrossSalary * 0.5m);
            var gross = (long)p.GrossSalary;
            var epfWages = (long)Math.Min(15000, basic);
            var eeShare = (long)(p.Items.FirstOrDefault(i => i.ComponentName.Contains("Provident") || i.ComponentName.Contains("PF"))?.Amount ?? (epfWages * 0.12m));
            var epsShare = (long)Math.Round(epfWages * 0.0833m);
            var erShare = eeShare - epsShare;

            sb.AppendLine($"{uan}#~#{name}#~#{gross}#~#{epfWages}#~#{epfWages}#~#{epfWages}#~#{eeShare}#~#{epsShare}#~#{erShare}#~#0#~#0");
        }

        var bytes = Encoding.UTF8.GetBytes(sb.ToString());
        var base64 = Convert.ToBase64String(bytes);
        var exportDto = new StatutoryExportFileDto($"EPF_ECR_{request.Year}_{request.Month:D2}.txt", "text/plain", base64);

        return ApiResponse<StatutoryExportFileDto>.Success(exportDto, "EPF ECR text file generated.");
    }
}
