using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.DTOs;

/// <summary>
/// Request payload for updating a holiday.
/// </summary>
public record UpdateHolidayRequestDto(
    string Name,
    DateOnly Date,
    HolidayType Type,
    int? BranchId,
    string? Description);
