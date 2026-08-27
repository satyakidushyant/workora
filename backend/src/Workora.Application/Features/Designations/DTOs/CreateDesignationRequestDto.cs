using Workora.Shared.Responses;

namespace Workora.Application.Features.Designations.DTOs;

/// <summary>
/// Request payload for creating a designation.
/// </summary>
public record CreateDesignationRequestDto(
    int DepartmentId,
    string Title,
    int Level,
    string? Grade,
    string? Description);
