using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.DTOs;

/// <summary>
/// DTO representing an asset assignment record.
/// </summary>
public record AssetAssignmentDto(
    int Id,
    int AssetId,
    string? AssetName,
    int EmployeeId,
    string? EmployeeName,
    DateOnly AssignedDate,
    DateOnly? ReturnedDate,
    string? ReturnCondition,
    bool IsActive);
