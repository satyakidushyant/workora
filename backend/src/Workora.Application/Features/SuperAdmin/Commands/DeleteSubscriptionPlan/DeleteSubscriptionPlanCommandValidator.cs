using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.SuperAdmin.DTOs;
namespace Workora.Application.Features.SuperAdmin.Commands.DeleteSubscriptionPlan;

/// <summary>
/// Validator for <see cref="DeleteSubscriptionPlanCommand"/>.
/// </summary>
public class DeleteSubscriptionPlanCommandValidator : AbstractValidator<DeleteSubscriptionPlanCommand>
{
    /// <summary>
    /// Initializes validation rules for DeleteSubscriptionPlanCommand.
    /// </summary>
    public DeleteSubscriptionPlanCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid subscription plan ID is required.");
    }
}
