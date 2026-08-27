using FluentValidation;
using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Assets.DTOs;
namespace Workora.Application.Features.Assets.Commands.ReturnAsset;

/// <summary>
/// Command to return an assigned asset back to company inventory.
/// </summary>
public record ReturnAssetCommand(
    int AssetId,
    DateOnly ReturnedDate,
    string? Condition = null) : IRequest<ApiResponse<bool>>;
