using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Policies.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Policies.Commands.CreatePolicy;

/// <summary>
/// Validator for <see cref="CreatePolicyCommand"/>.
/// </summary>
public class CreatePolicyCommandValidator : AbstractValidator<CreatePolicyCommand>
{
    /// <summary>
    /// Initializes validation rules for policy creation.
    /// </summary>
    public CreatePolicyCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200).WithMessage("Title is required.");
        RuleFor(x => x.Content).NotEmpty().WithMessage("Policy content is required.");
        RuleFor(x => x.Version).NotEmpty().MaximumLength(50).WithMessage("Version string is required.");
    }
}
