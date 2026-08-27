using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.DTOs;

/// <summary>
/// Data transfer object for active employee shift assignment.
/// </summary>
public record ShiftAssignmentDto(
    int Id,
    int EmployeeId,
    int ShiftId,
    string ShiftName,
    TimeOnly StartTime,
    TimeOnly EndTime,
    DateOnly EffectiveFrom,
    DateOnly? EffectiveTo,
    bool IsActive);
