using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.DTOs;

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
