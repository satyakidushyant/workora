using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.DTOs;

/// <summary>
/// Payroll expense item DTO.
/// </summary>
public record PayrollExpenseItemDto(
    string Period,
    decimal GrossTotal,
    decimal DeductionsTotal,
    decimal NetTotal);
