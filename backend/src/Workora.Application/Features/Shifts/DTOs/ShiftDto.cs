namespace Workora.Application.Features.Shifts.DTOs;

/// <summary>
/// Data transfer object representing a shift schedule.
/// </summary>
public record ShiftDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    int? BranchId,
    string Name,
    string Code,
    TimeOnly StartTime,
    TimeOnly EndTime,
    bool SpansMidnight,
    int GracePeriodMinutes,
    int BreakMinutes,
    string? Description,
    bool IsActive,
    DateTimeOffset CreatedAt);

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

/// <summary>
/// Request payload for creating a shift.
/// </summary>
public record CreateShiftRequestDto(
    int CompanyId,
    string Name,
    string Code,
    TimeOnly StartTime,
    TimeOnly EndTime,
    bool SpansMidnight,
    int GracePeriodMinutes,
    int BreakMinutes,
    int? BranchId,
    string? Description);

/// <summary>
/// Request payload for updating a shift.
/// </summary>
public record UpdateShiftRequestDto(
    string Name,
    string Code,
    TimeOnly StartTime,
    TimeOnly EndTime,
    bool SpansMidnight,
    int GracePeriodMinutes,
    int BreakMinutes,
    int? BranchId,
    string? Description);

/// <summary>
/// Request payload for assigning a shift to an employee.
/// </summary>
public record AssignShiftRequestDto(
    int EmployeeId,
    int ShiftId,
    DateOnly EffectiveFrom,
    DateOnly? EffectiveTo);

/// <summary>
/// Request payload for unassigning / ending a shift.
/// </summary>
public record UnassignShiftRequestDto(
    int EmployeeId,
    DateOnly EffectiveTo);
