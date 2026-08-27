using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Onboarding.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Onboarding.Commands.CreateOnboardingChecklist;

/// <summary>
/// Validator for <see cref="CreateOnboardingChecklistCommand"/>.
/// </summary>
public class CreateOnboardingChecklistCommandValidator : AbstractValidator<CreateOnboardingChecklistCommand>
{
    /// <summary>
    /// Initializes validation rules for creating an onboarding checklist.
    /// </summary>
    public CreateOnboardingChecklistCommandValidator()
    {
        RuleFor(x => x.TaskName).NotEmpty().MaximumLength(150).WithMessage("Task name is required and cannot exceed 150 characters.");
        RuleFor(x => x.AssignedRole).NotEmpty().MaximumLength(50).WithMessage("Assigned role is required.");
    }
}
