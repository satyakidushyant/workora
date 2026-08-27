using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.DTOs;

/// <summary>
/// DTO representing a line item on a payslip.
/// </summary>
public record PayslipItemDto(
    int Id,
    string ComponentName,
    string ComponentCode,
    ComponentType Type,
    decimal Amount);
