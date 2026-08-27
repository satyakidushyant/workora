using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Recruitment.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Recruitment.Commands.CreateJobOffer;

/// <summary>
/// Validator for <see cref="CreateJobOfferCommand"/>.
/// </summary>
public class CreateJobOfferCommandValidator : AbstractValidator<CreateJobOfferCommand>
{
    /// <summary>
    /// Initializes validation rules for creating a job offer.
    /// </summary>
    public CreateJobOfferCommandValidator()
    {
        RuleFor(x => x.CandidateId).GreaterThan(0).WithMessage("Valid candidate ID is required.");
        RuleFor(x => x.OfferedSalary).GreaterThan(0).WithMessage("Offered salary must be greater than zero.");
        RuleFor(x => x.ExpiryDate).Must((cmd, exp) => exp >= DateOnly.FromDateTime(DateTime.UtcNow)).WithMessage("Expiry date cannot be in the past.");
    }
}
