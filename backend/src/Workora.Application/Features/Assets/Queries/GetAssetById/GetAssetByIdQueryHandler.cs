using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Features.Assets.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.Queries.GetAssetById;

/// <summary>
/// Handler for <see cref="GetAssetByIdQuery"/>.
/// </summary>
public class GetAssetByIdQueryHandler : IRequestHandler<GetAssetByIdQuery, ApiResponse<AssetDto>>
{
    private readonly IGenericRepository<Asset> _assetRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetAssetByIdQueryHandler"/> class.
    /// </summary>
    public GetAssetByIdQueryHandler(IGenericRepository<Asset> assetRepository)
    {
        _assetRepository = assetRepository;
    }

    /// <summary>
    /// Executes retrieval of asset by ID.
    /// </summary>
    public async Task<ApiResponse<AssetDto>> Handle(GetAssetByIdQuery request, CancellationToken cancellationToken)
    {
        var asset = await _assetRepository.GetByIdAsync(request.Id, cancellationToken);
        if (asset == null)
        {
            return ApiResponse<AssetDto>.Fail(ResponseMessage.AssetNotFound.GetDescription());
        }

        var dto = new AssetDto(
            asset.Id,
            asset.Uuid,
            asset.CompanyId,
            asset.Name,
            asset.AssetTag,
            asset.SerialNumber,
            asset.Category,
            asset.Status,
            asset.PurchaseCost,
            asset.PurchaseDate,
            null,
            null,
            asset.IsActive,
            asset.CreatedAt);

        return ApiResponse<AssetDto>.Success(dto, ResponseMessage.AssetRetrieved.GetDescription());
    }
}
