using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.DTOs;

/// <summary>
/// Request payload for creating a holiday.
/// </summary>
public record CreateHolidayRequestDto(
    int CompanyId,
    string Name,
    DateOnly Date,
    HolidayType Type,
    int? BranchId,
    string? Description);
