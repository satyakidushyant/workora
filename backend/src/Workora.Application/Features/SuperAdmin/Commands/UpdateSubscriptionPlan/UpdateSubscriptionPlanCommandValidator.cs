using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SuperAdmin.Commands.UpdateSubscriptionPlan;

/// <summary>
/// Validator for <see cref="UpdateSubscriptionPlanCommand"/>.
/// </summary>
public class UpdateSubscriptionPlanCommandValidator : AbstractValidator<UpdateSubscriptionPlanCommand>
{
    /// <summary>
    /// Initializes validation rules for UpdateSubscriptionPlanCommand.
    /// </summary>
    public UpdateSubscriptionPlanCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid subscription plan ID is required.");
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Plan name is required.")
            .MaximumLength(100).WithMessage("Plan name must not exceed 100 characters.");
        RuleFor(x => x.Price).GreaterThanOrEqualTo(0).WithMessage("Price cannot be negative.");
        RuleFor(x => x.MaxEmployees).GreaterThan(0).WithMessage("Max employees must be greater than zero.");
    }
}
