using Workora.Shared.Responses;

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
