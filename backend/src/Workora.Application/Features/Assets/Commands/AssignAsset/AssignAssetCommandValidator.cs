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
/// Validator for <see cref="AssignAssetCommand"/>.
/// </summary>
public class AssignAssetCommandValidator : AbstractValidator<AssignAssetCommand>
{
    /// <summary>
    /// Initializes validation rules for assigning an asset.
    /// </summary>
    public AssignAssetCommandValidator()
    {
        RuleFor(x => x.AssetId).GreaterThan(0).WithMessage("Valid asset ID is required.");
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
    }
}
