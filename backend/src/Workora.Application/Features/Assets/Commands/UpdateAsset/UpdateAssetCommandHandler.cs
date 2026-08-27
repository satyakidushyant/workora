using MediatR;
using Workora.Application.Features.Assets.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.Commands.UpdateAsset;

/// <summary>
/// Handler for <see cref="UpdateAssetCommand"/>.
/// </summary>
public class UpdateAssetCommandHandler : IRequestHandler<UpdateAssetCommand, ApiResponse<AssetDto>>
{
    private readonly IGenericRepository<Asset> _assetRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="UpdateAssetCommandHandler"/> class.
    /// </summary>
    public UpdateAssetCommandHandler(
        IGenericRepository<Asset> assetRepository,
        IUnitOfWork unitOfWork)
    {
        _assetRepository = assetRepository;
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Executes updating asset record.
    /// </summary>
    public async Task<ApiResponse<AssetDto>> Handle(UpdateAssetCommand request, CancellationToken cancellationToken)
    {
        var asset = await _assetRepository.GetByIdAsync(request.Id, cancellationToken);
        if (asset == null)
        {
            return ApiResponse<AssetDto>.Fail($"Asset {request.Id} not found.");
        }

        _assetRepository.Update(asset);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

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

        return ApiResponse<AssetDto>.Success(dto, "Asset details updated successfully.");
    }
}
