using MediatR;
using Workora.Application.Features.Assets.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.Queries.GetMyAssignedAssets;

/// <summary>
/// Handler for <see cref="GetMyAssignedAssetsQuery"/>.
/// </summary>
public class GetMyAssignedAssetsQueryHandler : IRequestHandler<GetMyAssignedAssetsQuery, ApiResponse<IReadOnlyList<AssetDto>>>
{
    private readonly IGenericRepository<Asset> _assetRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetMyAssignedAssetsQueryHandler"/> class.
    /// </summary>
    public GetMyAssignedAssetsQueryHandler(IGenericRepository<Asset> assetRepository)
    {
        _assetRepository = assetRepository;
    }

    /// <summary>
    /// Handles fetching caller's assigned assets list.
    /// </summary>
    public Task<ApiResponse<IReadOnlyList<AssetDto>>> Handle(GetMyAssignedAssetsQuery request, CancellationToken cancellationToken)
    {
        var items = _assetRepository.GetQueryable()
            .Where(a => a.IsActive)
            .ToList()
            .Select(a => new AssetDto(
                a.Id,
                a.Uuid,
                a.CompanyId,
                a.Name,
                a.AssetTag,
                a.SerialNumber,
                a.Category,
                a.Status,
                a.PurchaseCost,
                a.PurchaseDate,
                null,
                null,
                a.IsActive,
                a.CreatedAt))
            .ToList();

        return Task.FromResult(ApiResponse<IReadOnlyList<AssetDto>>.Success(items, "Caller assigned assets list retrieved."));
    }
}
