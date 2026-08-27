using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.SuperAdmin.Commands.CreateSubscriptionPlan;

/// <summary>
/// Validator for <see cref="CreateSubscriptionPlanCommand"/>.
/// </summary>
public class CreateSubscriptionPlanCommandValidator : AbstractValidator<CreateSubscriptionPlanCommand>
{
    /// <summary>
    /// Initializes validation rules for CreateSubscriptionPlanCommand.
    /// </summary>
    public CreateSubscriptionPlanCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Plan name is required.")
            .MaximumLength(100).WithMessage("Plan name must not exceed 100 characters.");

        RuleFor(x => x.Price)
            .GreaterThanOrEqualTo(0).WithMessage("Price cannot be negative.");

        RuleFor(x => x.MaxEmployees)
            .GreaterThan(0).WithMessage("Max employees must be greater than zero.");
    }
}
