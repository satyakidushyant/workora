using Workora.Domain.Enums;

namespace Workora.Application.Features.Assets.DTOs;

/// <summary>
/// DTO representing an equipment asset.
/// </summary>
public record AssetDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    string Name,
    string AssetTag,
    string? SerialNumber,
    string Category,
    AssetStatus Status,
    decimal? PurchaseCost,
    DateOnly? PurchaseDate,
    string? CurrentAssignedEmployeeName,
    int? CurrentAssignedEmployeeId,
    bool IsActive,
    DateTimeOffset CreatedAt);

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

/// <summary>
/// Request payload for creating an asset.
/// </summary>
public record CreateAssetRequestDto(
    int CompanyId,
    string Name,
    string AssetTag,
    string Category,
    string? SerialNumber,
    decimal? PurchaseCost,
    DateOnly? PurchaseDate);

/// <summary>
/// Request payload for checking out / assigning an asset.
/// </summary>
public record AssignAssetRequestDto(
    int AssetId,
    int EmployeeId,
    DateOnly AssignedDate);

/// <summary>
/// Request payload for returning an asset.
/// </summary>
public record ReturnAssetRequestDto(
    int AssetId,
    DateOnly ReturnedDate,
    string? Condition);
