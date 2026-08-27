using MediatR;
using Workora.Application.Features.Assets.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.Queries.GetAssetById;

/// <summary>
/// Query to retrieve details of a specific asset item.
/// </summary>
public record GetAssetByIdQuery(int Id) : IRequest<ApiResponse<AssetDto>>;
