using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Assets.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.Queries.GetAssetsList;

/// <summary>
/// Query to retrieve a paginated list of assets with dynamic pagination and filtering.
/// </summary>
public record GetAssetsListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<AssetDto>>>
{
    /// <summary>
    /// Gets or init optional filter for target company ID.
    /// </summary>
    public int? CompanyId { get; init; }

    /// <summary>
    /// Gets or init optional filter for asset category.
    /// </summary>
    public string? Category { get; init; }

    /// <summary>
    /// Gets or init optional filter for asset status.
    /// </summary>
    public AssetStatus? Status { get; init; }
}

