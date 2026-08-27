using AutoMapper;
using MediatR;
using Workora.Application.Features.Assets.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.Queries.GetAssetsList;

/// <summary>
/// Query to retrieve a paginated list of assets.
/// </summary>
public record GetAssetsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    int? CompanyId = null,
    string? Category = null,
    AssetStatus? Status = null,
    string? SearchTerm = null) : IRequest<ApiResponse<PagedResponse<AssetDto>>>;
