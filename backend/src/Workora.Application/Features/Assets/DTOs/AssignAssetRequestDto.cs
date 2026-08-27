using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.DTOs;

/// <summary>
/// Request payload for checking out / assigning an asset.
/// </summary>
public record AssignAssetRequestDto(
    int AssetId,
    int EmployeeId,
    DateOnly AssignedDate);
