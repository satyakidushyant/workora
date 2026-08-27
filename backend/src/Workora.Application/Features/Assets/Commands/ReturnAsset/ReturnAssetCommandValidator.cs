using FluentValidation;
using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Assets.DTOs;
namespace Workora.Application.Features.Assets.Commands.ReturnAsset;

/// <summary>
/// Validator for <see cref="ReturnAssetCommand"/>.
/// </summary>
public class ReturnAssetCommandValidator : AbstractValidator<ReturnAssetCommand>
{
    /// <summary>
    /// Initializes validation rules for returning an asset.
    /// </summary>
    public ReturnAssetCommandValidator()
    {
        RuleFor(x => x.AssetId).GreaterThan(0).WithMessage("Valid asset ID is required.");
    }
}
