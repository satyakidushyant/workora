using Workora.Shared.Responses;

namespace Workora.Application.Features.Designations.DTOs;

/// <summary>
/// Request payload for updating a designation.
/// </summary>
public record UpdateDesignationRequestDto(
    int DepartmentId,
    string Title,
    int Level,
    string? Grade,
    string? Description);
