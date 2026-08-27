using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.SuperAdmin.DTOs;
namespace Workora.Application.Features.SuperAdmin.Commands.SuspendOrganization;

/// <summary>
/// Validator for <see cref="SuspendOrganizationCommand"/>.
/// </summary>
public class SuspendOrganizationCommandValidator : AbstractValidator<SuspendOrganizationCommand>
{
    /// <summary>
    /// Initializes validation rules for SuspendOrganizationCommand.
    /// </summary>
    public SuspendOrganizationCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid organization ID is required.");
    }
}
