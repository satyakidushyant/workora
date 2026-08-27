using Workora.Domain.Enums;
using Workora.Shared.Responses;

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
