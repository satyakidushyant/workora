using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.CreateAppraisal;

/// <summary>
/// Validator for <see cref="CreateAppraisalCommand"/>.
/// </summary>
public class CreateAppraisalCommandValidator : AbstractValidator<CreateAppraisalCommand>
{
    /// <summary>
    /// Initializes validation rules for appraisal initiation.
    /// </summary>
    public CreateAppraisalCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.ReviewerEmployeeId).GreaterThan(0).WithMessage("Valid reviewer ID is required.");
        RuleFor(x => x.Period).NotEmpty().MaximumLength(100).WithMessage("Review period is required.");
        RuleFor(x => x.Year).GreaterThanOrEqualTo(2020).WithMessage("Valid year is required.");
    }
}
