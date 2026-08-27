using MediatR;
using Workora.Application.Features.Assets.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.Commands.UpdateAsset;

/// <summary>
/// Command to update details of an existing asset.
/// </summary>
public record UpdateAssetCommand(
    int Id,
    string Name,
    string Category,
    string? SerialNumber,
    decimal? PurchaseCost,
    DateOnly? PurchaseDate) : IRequest<ApiResponse<AssetDto>>;
