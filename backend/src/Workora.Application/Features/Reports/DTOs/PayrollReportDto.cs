using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.DTOs;

/// <summary>
/// Payroll expense report DTO.
/// </summary>
public record PayrollReportDto(
    IReadOnlyList<PayrollExpenseItemDto> History);
