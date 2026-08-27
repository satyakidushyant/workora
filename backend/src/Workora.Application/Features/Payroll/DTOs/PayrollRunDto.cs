using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.DTOs;

/// <summary>
/// DTO representing a monthly payroll computation cycle.
/// </summary>
public record PayrollRunDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    int PeriodMonth,
    int PeriodYear,
    PayrollStatus Status,
    decimal TotalGrossPay,
    decimal TotalDeductions,
    decimal TotalNetPay,
    int TotalEmployees,
    DateTimeOffset? ProcessedAt,
    int? ApprovedBy,
    DateTimeOffset? ApprovedAt,
    DateTimeOffset? DisbursedAt,
    DateTimeOffset CreatedAt);
