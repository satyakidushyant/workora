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
/// Validator for <see cref="CreateAssetCommand"/>.
/// </summary>
public class CreateAssetCommandValidator : AbstractValidator<CreateAssetCommand>
{
    /// <summary>
    /// Initializes validation rules for creating an asset.
    /// </summary>
    public CreateAssetCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150).WithMessage("Asset name is required.");
        RuleFor(x => x.AssetTag).NotEmpty().MaximumLength(50).WithMessage("Asset tag is required.");
        RuleFor(x => x.Category).NotEmpty().MaximumLength(100).WithMessage("Category is required.");
    }
}
