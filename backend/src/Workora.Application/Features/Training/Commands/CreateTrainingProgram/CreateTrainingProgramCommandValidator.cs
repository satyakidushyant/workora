using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Training.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Training.Commands.CreateTrainingProgram;

/// <summary>
/// Validator for <see cref="CreateTrainingProgramCommand"/>.
/// </summary>
public class CreateTrainingProgramCommandValidator : AbstractValidator<CreateTrainingProgramCommand>
{
    /// <summary>
    /// Initializes validation rules for training program creation.
    /// </summary>
    public CreateTrainingProgramCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200).WithMessage("Title is required.");
        RuleFor(x => x.TrainerName).NotEmpty().MaximumLength(150).WithMessage("Trainer name is required.");
        RuleFor(x => x.Capacity).GreaterThan(0).WithMessage("Capacity must be greater than zero.");
        RuleFor(x => x.EndDate).Must((cmd, end) => end >= cmd.StartDate).WithMessage("End date must be on or after start date.");
    }
}
