using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.FinalizeAppraisal;

/// <summary>
/// Validator for <see cref="FinalizeAppraisalCommand"/>.
/// </summary>
public class FinalizeAppraisalCommandValidator : AbstractValidator<FinalizeAppraisalCommand>
{
    /// <summary>
    /// Initializes validation rules for finalizing appraisal.
    /// </summary>
    public FinalizeAppraisalCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid appraisal ID is required.");
        RuleFor(x => x.FinalScore).InclusiveBetween(1m, 5m).WithMessage("Final score must be between 1 and 5.");
    }
}
