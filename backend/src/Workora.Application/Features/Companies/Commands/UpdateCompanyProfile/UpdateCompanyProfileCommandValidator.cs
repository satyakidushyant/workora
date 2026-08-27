using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Companies.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Companies.Commands.UpdateCompanyProfile;

/// <summary>
/// Validator for <see cref="UpdateCompanyProfileCommand"/>.
/// </summary>
public class UpdateCompanyProfileCommandValidator : AbstractValidator<UpdateCompanyProfileCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="UpdateCompanyProfileCommand"/>.
    /// </summary>
    public UpdateCompanyProfileCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Company name is required.")
            .MaximumLength(200).WithMessage("Company name must not exceed 200 characters.");

        RuleFor(x => x.FiscalYearStartMonth)
            .InclusiveBetween(1, 12).WithMessage("Fiscal year start month must be between 1 and 12.");

        RuleFor(x => x.Currency)
            .NotEmpty().WithMessage("Currency is required.")
            .MaximumLength(10).WithMessage("Currency code must not exceed 10 characters.");

        RuleFor(x => x.Email)
            .EmailAddress().When(x => !string.IsNullOrWhiteSpace(x.Email))
            .WithMessage("Invalid email format.");
    }
}
