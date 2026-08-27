using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.SubmitInterviewFeedback;

/// <summary>
/// Validator for <see cref="SubmitInterviewFeedbackCommand"/>.
/// </summary>
public class SubmitInterviewFeedbackCommandValidator : AbstractValidator<SubmitInterviewFeedbackCommand>
{
    /// <summary>
    /// Initializes validation rules for interview feedback.
    /// </summary>
    public SubmitInterviewFeedbackCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid interview ID is required.");
        RuleFor(x => x.Feedback).NotEmpty().WithMessage("Feedback comments are required.");
        RuleFor(x => x.Rating).InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5 stars.");
    }
}
