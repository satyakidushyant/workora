using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Training.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Training.Commands.EnrollInTraining;

/// <summary>
/// Validator for <see cref="EnrollInTrainingCommand"/>.
/// </summary>
public class EnrollInTrainingCommandValidator : AbstractValidator<EnrollInTrainingCommand>
{
    /// <summary>
    /// Initializes validation rules for enrolling in training.
    /// </summary>
    public EnrollInTrainingCommandValidator()
    {
        RuleFor(x => x.TrainingProgramId).GreaterThan(0).WithMessage("Valid program ID is required.");
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
    }
}
