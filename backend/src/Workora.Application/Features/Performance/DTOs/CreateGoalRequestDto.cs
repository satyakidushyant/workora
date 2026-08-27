using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.DTOs;

/// <summary>
/// Request payload for creating a goal.
/// </summary>
public record CreateGoalRequestDto(
    int EmployeeId,
    string Title,
    string Description,
    DateOnly TargetDate);
