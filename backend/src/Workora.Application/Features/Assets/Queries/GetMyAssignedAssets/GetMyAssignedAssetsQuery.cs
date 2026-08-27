using MediatR;
using Workora.Application.Features.Assets.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.Queries.GetMyAssignedAssets;

/// <summary>
/// Query to retrieve assets assigned to caller employee.
/// </summary>
public record GetMyAssignedAssetsQuery : IRequest<ApiResponse<IReadOnlyList<AssetDto>>>;
