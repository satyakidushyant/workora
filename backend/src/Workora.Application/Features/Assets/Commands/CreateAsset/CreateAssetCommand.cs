using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Assets.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Assets.Commands.CreateAsset;

/// <summary>
/// Command to create a new asset inventory record.
/// </summary>
public record CreateAssetCommand(
    int CompanyId,
    string Name,
    string AssetTag,
    string Category,
    string? SerialNumber,
    decimal? PurchaseCost,
    DateOnly? PurchaseDate) : IRequest<ApiResponse<AssetDto>>;
