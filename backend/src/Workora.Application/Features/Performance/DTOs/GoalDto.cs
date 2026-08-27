using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.DTOs;

/// <summary>
/// DTO representing an employee KPI / Goal.
/// </summary>
public record GoalDto(
    int Id,
    Guid Uuid,
    int EmployeeId,
    string? EmployeeName,
    string Title,
    string Description,
    DateOnly TargetDate,
    int ProgressPercentage,
    GoalStatus Status,
    bool IsActive,
    DateTimeOffset CreatedAt);
