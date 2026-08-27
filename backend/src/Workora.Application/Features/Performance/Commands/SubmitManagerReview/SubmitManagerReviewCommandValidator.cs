using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Commands.SubmitManagerReview;

/// <summary>
/// Validator for <see cref="SubmitManagerReviewCommand"/>.
/// </summary>
public class SubmitManagerReviewCommandValidator : AbstractValidator<SubmitManagerReviewCommand>
{
    /// <summary>
    /// Initializes validation rules for manager review.
    /// </summary>
    public SubmitManagerReviewCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid appraisal ID is required.");
        RuleFor(x => x.Comments).NotEmpty().WithMessage("Comments are required.");
        RuleFor(x => x.Rating).InclusiveBetween(1, 5).WithMessage("Rating must be between 1 and 5.");
    }
}
