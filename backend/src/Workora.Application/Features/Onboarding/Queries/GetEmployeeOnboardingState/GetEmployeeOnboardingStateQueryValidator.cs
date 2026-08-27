using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Onboarding.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Onboarding.Queries.GetEmployeeOnboardingState;

/// <summary>
/// Validator for <see cref="GetEmployeeOnboardingStateQuery"/>.
/// </summary>
public class GetEmployeeOnboardingStateQueryValidator : AbstractValidator<GetEmployeeOnboardingStateQuery>
{
    /// <summary>
    /// Initializes validation rules for getting employee onboarding state.
    /// </summary>
    public GetEmployeeOnboardingStateQueryValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
    }
}
