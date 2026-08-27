using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Commands.RegisterOrganization;

/// <summary>
/// Validator for <see cref="RegisterOrganizationCommand"/>.
/// </summary>
public class RegisterOrganizationCommandValidator : AbstractValidator<RegisterOrganizationCommand>
{
    /// <summary>
    /// Initializes validation rules for RegisterOrganizationCommand.
    /// </summary>
    public RegisterOrganizationCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Organization name is required.")
            .MaximumLength(150).WithMessage("Organization name must not exceed 150 characters.");

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Organization code is required.")
            .MaximumLength(20).WithMessage("Organization code must not exceed 20 characters.");

        RuleFor(x => x.FiscalYearStartMonth)
            .InclusiveBetween(1, 12).WithMessage("Fiscal year start month must be between 1 and 12.");
    }
}
