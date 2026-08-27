using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.UpdateJobPosting;

/// <summary>
/// Validator for <see cref="UpdateJobPostingCommand"/>.
/// </summary>
public class UpdateJobPostingCommandValidator : AbstractValidator<UpdateJobPostingCommand>
{
    /// <summary>
    /// Initializes validation rules for updating a job posting.
    /// </summary>
    public UpdateJobPostingCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid job posting ID is required.");
        RuleFor(x => x.DepartmentId).GreaterThan(0).WithMessage("Valid department ID is required.");
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200).WithMessage("Job title is required.");
    }
}
