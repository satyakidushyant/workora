using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.DTOs;

/// <summary>
/// Request payload for updating goal progress.
/// </summary>
public record UpdateGoalProgressRequestDto(
    int ProgressPercentage,
    GoalStatus Status);
