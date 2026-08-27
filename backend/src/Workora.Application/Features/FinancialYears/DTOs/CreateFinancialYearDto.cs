using Workora.Shared.Responses;

namespace Workora.Application.Features.FinancialYears.DTOs;

/// <summary>
/// Request payload for creating a financial year.
/// </summary>
public record CreateFinancialYearDto(
    string Name,
    DateOnly StartDate,
    DateOnly EndDate,
    bool IsCurrent = false);
