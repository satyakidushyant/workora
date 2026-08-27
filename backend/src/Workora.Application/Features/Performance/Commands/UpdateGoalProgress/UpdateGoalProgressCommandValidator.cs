using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.UpdateGoalProgress;

/// <summary>
/// Validator for <see cref="UpdateGoalProgressCommand"/>.
/// </summary>
public class UpdateGoalProgressCommandValidator : AbstractValidator<UpdateGoalProgressCommand>
{
    /// <summary>
    /// Initializes validation rules for updating goal progress.
    /// </summary>
    public UpdateGoalProgressCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid goal ID is required.");
        RuleFor(x => x.ProgressPercentage).InclusiveBetween(0, 100).WithMessage("Progress percentage must be between 0 and 100.");
    }
}
