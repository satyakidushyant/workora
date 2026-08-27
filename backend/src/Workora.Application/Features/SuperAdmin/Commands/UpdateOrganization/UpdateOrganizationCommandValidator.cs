using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Commands.UpdateOrganization;

/// <summary>
/// Validator for <see cref="UpdateOrganizationCommand"/>.
/// </summary>
public class UpdateOrganizationCommandValidator : AbstractValidator<UpdateOrganizationCommand>
{
    /// <summary>
    /// Initializes validation rules for UpdateOrganizationCommand.
    /// </summary>
    public UpdateOrganizationCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid organization ID is required.");
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Organization name is required.")
            .MaximumLength(150).WithMessage("Organization name must not exceed 150 characters.");

        RuleFor(x => x.FiscalYearStartMonth)
            .InclusiveBetween(1, 12).WithMessage("Fiscal year start month must be between 1 and 12.");
    }
}
