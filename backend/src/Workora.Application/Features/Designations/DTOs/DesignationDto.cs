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

/// <summary>
/// Request payload for creating a designation.
/// </summary>
public record CreateDesignationRequestDto(
    int DepartmentId,
    string Title,
    int Level,
    string? Grade,
    string? Description);

/// <summary>
/// Request payload for updating a designation.
/// </summary>
public record UpdateDesignationRequestDto(
    int DepartmentId,
    string Title,
    int Level,
    string? Grade,
    string? Description);
