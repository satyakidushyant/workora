using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.CreateGoal;

/// <summary>
/// Validator for <see cref="CreateGoalCommand"/>.
/// </summary>
public class CreateGoalCommandValidator : AbstractValidator<CreateGoalCommand>
{
    /// <summary>
    /// Initializes validation rules for creating goals.
    /// </summary>
    public CreateGoalCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200).WithMessage("Title is required.");
        RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required.");
    }
}
