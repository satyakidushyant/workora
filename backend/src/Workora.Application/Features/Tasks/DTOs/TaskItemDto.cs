using Workora.Domain.Enums;

namespace Workora.Application.Features.Tasks.DTOs;

/// <summary>
/// Data transfer object representing an assigned task.
/// </summary>
public record TaskItemDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    string Title,
    string? Description,
    int AssignedToEmployeeId,
    string? AssignedToEmployeeName,
    int CreatedByEmployeeId,
    string? CreatedByEmployeeName,
    TaskPriority Priority,
    DateOnly DueDate,
    TaskItemStatus Status,
    DateTimeOffset? CompletedAt,
    DateTimeOffset CreatedAt);
