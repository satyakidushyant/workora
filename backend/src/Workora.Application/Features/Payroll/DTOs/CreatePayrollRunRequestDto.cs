using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.DTOs;

/// <summary>
/// Request payload for creating / executing a payroll run.
/// </summary>
public record CreatePayrollRunRequestDto(
    int CompanyId,
    int PeriodMonth,
    int PeriodYear);
