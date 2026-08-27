using Workora.Shared.Responses;

namespace Workora.Application.Features.FinancialYears.DTOs;

/// <summary>
/// Data transfer object for a financial year.
/// </summary>
public record FinancialYearDto(
    int Id,
    Guid Uuid,
    string Name,
    DateOnly StartDate,
    DateOnly EndDate,
    bool IsCurrent,
    bool IsClosed,
    DateTimeOffset CreatedAt);
