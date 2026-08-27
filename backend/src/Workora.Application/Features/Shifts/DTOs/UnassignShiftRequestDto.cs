using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.DTOs;

/// <summary>
/// Request payload for unassigning / ending a shift.
/// </summary>
public record UnassignShiftRequestDto(
    int EmployeeId,
    DateOnly EffectiveTo);
