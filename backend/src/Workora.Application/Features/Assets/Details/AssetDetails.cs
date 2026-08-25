using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.Assets.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Assets.Details;

/// <summary>
/// Query to retrieve details of a specific asset item.
/// </summary>
public record GetAssetByIdQuery(int Id) : IRequest<ApiResponse<AssetDto>>;

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
            return ApiResponse<AssetDto>.Fail($"Asset {request.Id} not found.");
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

        return ApiResponse<AssetDto>.Success(dto, "Asset details retrieved successfully.");
    }
}

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

/// <summary>
/// Query to retrieve assets assigned to caller employee.
/// </summary>
public record GetMyAssignedAssetsQuery : IRequest<ApiResponse<IReadOnlyList<AssetDto>>>;

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
