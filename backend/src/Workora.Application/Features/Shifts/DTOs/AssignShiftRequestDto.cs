using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.DTOs;

/// <summary>
/// Request payload for assigning a shift to an employee.
/// </summary>
public record AssignShiftRequestDto(
    int EmployeeId,
    int ShiftId,
    DateOnly EffectiveFrom,
    DateOnly? EffectiveTo);
