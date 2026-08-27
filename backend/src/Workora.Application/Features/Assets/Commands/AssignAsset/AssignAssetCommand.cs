using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Assets.DTOs;
namespace Workora.Application.Features.Assets.Commands.AssignAsset;

/// <summary>
/// Command to assign an asset to an employee.
/// </summary>
public record AssignAssetCommand(
    int AssetId,
    int EmployeeId,
    DateOnly AssignedDate) : IRequest<ApiResponse<bool>>;
