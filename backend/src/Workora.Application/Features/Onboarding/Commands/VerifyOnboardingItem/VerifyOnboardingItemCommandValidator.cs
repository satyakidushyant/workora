using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Onboarding.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Onboarding.Commands.VerifyOnboardingItem;

/// <summary>
/// Validator for <see cref="VerifyOnboardingItemCommand"/>.
/// </summary>
public class VerifyOnboardingItemCommandValidator : AbstractValidator<VerifyOnboardingItemCommand>
{
    /// <summary>
    /// Initializes validation rules for verifying an onboarding item.
    /// </summary>
    public VerifyOnboardingItemCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.ChecklistId).GreaterThan(0).WithMessage("Valid checklist ID is required.");
    }
}
