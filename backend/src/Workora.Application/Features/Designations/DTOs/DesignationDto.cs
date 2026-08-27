using Workora.Shared.Responses;

namespace Workora.Application.Features.Designations.DTOs;

/// <summary>
/// Data transfer object representing a designation summary.
/// </summary>
public record DesignationDto(
    int Id,
    Guid Uuid,
    int DepartmentId,
    string? DepartmentName,
    string Title,
    int Level,
    string? Grade,
    string? Description,
    bool IsActive,
    DateTimeOffset CreatedAt);
