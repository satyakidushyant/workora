using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.CreateJobPosting;

/// <summary>
/// Validator for <see cref="CreateJobPostingCommand"/>.
/// </summary>
public class CreateJobPostingCommandValidator : AbstractValidator<CreateJobPostingCommand>
{
    /// <summary>
    /// Initializes validation rules for job posting creation.
    /// </summary>
    public CreateJobPostingCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.DepartmentId).GreaterThan(0).WithMessage("Valid department ID is required.");
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200).WithMessage("Job title is required.");
        RuleFor(x => x.Description).NotEmpty().WithMessage("Job description is required.");
        RuleFor(x => x.Requirements).NotEmpty().WithMessage("Requirements are required.");
        RuleFor(x => x.Location).NotEmpty().MaximumLength(150).WithMessage("Location is required.");
        RuleFor(x => x.ExperienceYearsMax).GreaterThanOrEqualTo(x => x.ExperienceYearsMin).WithMessage("Max experience cannot be less than min experience.");
    }
}
