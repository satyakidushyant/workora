using FluentValidation;

using Workora.Application.Features.Assets.DTOs;
namespace Workora.Application.Features.Assets.Commands.UpdateAsset;

/// <summary>
/// Validator for <see cref="UpdateAssetCommand"/>.
/// </summary>
public class UpdateAssetCommandValidator : AbstractValidator<UpdateAssetCommand>
{
    /// <summary>
    /// Initializes validation rules for UpdateAssetCommand.
    /// </summary>
    public UpdateAssetCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid asset ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200).WithMessage("Asset name is required.");
        RuleFor(x => x.Category).NotEmpty().MaximumLength(100).WithMessage("Asset category is required.");
    }
}
