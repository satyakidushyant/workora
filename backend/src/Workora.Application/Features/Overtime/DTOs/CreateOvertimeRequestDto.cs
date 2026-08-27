using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Overtime.DTOs;

/// <summary>
/// Request payload for creating an overtime request.
/// </summary>
public record CreateOvertimeRequestDto(
    int EmployeeId,
    DateOnly OvertimeDate,
    TimeOnly StartTime,
    TimeOnly EndTime,
    decimal HoursRequested,
    string Reason);
