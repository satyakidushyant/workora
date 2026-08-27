using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.DTOs;

/// <summary>
/// DTO representing a payroll run with itemized employee payslips.
/// </summary>
public record PayrollRunDetailDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    int PeriodMonth,
    int PeriodYear,
    PayrollStatus Status,
    decimal TotalGrossPay,
    decimal TotalDeductions,
    decimal TotalNetPay,
    DateTimeOffset? ProcessedAt,
    int? ApprovedBy,
    DateTimeOffset? ApprovedAt,
    DateTimeOffset? DisbursedAt,
    IReadOnlyList<PayslipDto> Payslips,
    DateTimeOffset CreatedAt);
