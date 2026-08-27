using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.DTOs;

/// <summary>
/// Request payload for returning an asset.
/// </summary>
public record ReturnAssetRequestDto(
    int AssetId,
    DateOnly ReturnedDate,
    string? Condition);
