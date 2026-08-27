using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.CreateCandidate;

/// <summary>
/// Validator for <see cref="CreateCandidateCommand"/>.
/// </summary>
public class CreateCandidateCommandValidator : AbstractValidator<CreateCandidateCommand>
{
    /// <summary>
    /// Initializes validation rules for candidate applications.
    /// </summary>
    public CreateCandidateCommandValidator()
    {
        RuleFor(x => x.JobPostingId).GreaterThan(0).WithMessage("Valid job posting ID is required.");
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100).WithMessage("First name is required.");
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100).WithMessage("Last name is required.");
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Valid email is required.");
    }
}
