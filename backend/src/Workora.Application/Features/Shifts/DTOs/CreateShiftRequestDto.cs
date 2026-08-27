using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.DTOs;

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
