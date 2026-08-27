using FluentValidation;
using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Companies.DTOs;
namespace Workora.Application.Features.Companies.Commands.UploadCompanyLogo;

/// <summary>
/// Validator for <see cref="UploadCompanyLogoCommand"/>.
/// </summary>
public class UploadCompanyLogoCommandValidator : AbstractValidator<UploadCompanyLogoCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="UploadCompanyLogoCommand"/>.
    /// </summary>
    public UploadCompanyLogoCommandValidator()
    {
        RuleFor(x => x.LogoUrl)
            .NotEmpty().WithMessage("Logo URL is required.")
            .MaximumLength(500).WithMessage("Logo URL must not exceed 500 characters.");
    }
}
