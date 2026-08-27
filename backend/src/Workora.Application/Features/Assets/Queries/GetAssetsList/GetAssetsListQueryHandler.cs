using AutoMapper;
using MediatR;
using Workora.Application.Features.Assets.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.Queries.GetAssetsList;

/// <summary>
/// Handler for <see cref="GetAssetsListQuery"/>.
/// </summary>
public class GetAssetsListQueryHandler : IRequestHandler<GetAssetsListQuery, ApiResponse<PagedResponse<AssetDto>>>
{
    private readonly IAssetRepository _assetRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetAssetsListQueryHandler"/> class.
    /// </summary>
    public GetAssetsListQueryHandler(IAssetRepository assetRepository, IMapper mapper)
    {
        _assetRepository = assetRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<AssetDto>>> Handle(GetAssetsListQuery request, CancellationToken ct)
    {
        var assets = await _assetRepository.GetAssetsPagedAsync(
            request.PageNumber,
            request.PageSize,
            request.CompanyId,
            request.Category,
            request.Status,
            request.SearchTerm,
            ct);

        var totalCount = await _assetRepository.GetAssetsCountAsync(
            request.CompanyId,
            request.Category,
            request.Status,
            request.SearchTerm,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<AssetDto>>(assets);
        var paged = new PagedResponse<AssetDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<AssetDto>>.Success(paged);
    }
}
