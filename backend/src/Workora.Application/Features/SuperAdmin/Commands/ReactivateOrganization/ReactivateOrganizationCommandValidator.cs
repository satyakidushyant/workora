using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.SuperAdmin.DTOs;
namespace Workora.Application.Features.SuperAdmin.Commands.ReactivateOrganization;

/// <summary>
/// Validator for <see cref="ReactivateOrganizationCommand"/>.
/// </summary>
public class ReactivateOrganizationCommandValidator : AbstractValidator<ReactivateOrganizationCommand>
{
    /// <summary>
    /// Initializes validation rules for ReactivateOrganizationCommand.
    /// </summary>
    public ReactivateOrganizationCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid organization ID is required.");
    }
}
