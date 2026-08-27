using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Branches.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.Commands.UpdateBranch;

/// <summary>
/// Validator for <see cref="UpdateBranchCommand"/>.
/// </summary>
public class UpdateBranchCommandValidator : AbstractValidator<UpdateBranchCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="UpdateBranchCommand"/>.
    /// </summary>
    public UpdateBranchCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid branch ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200).WithMessage("Branch name is required.");
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50).WithMessage("Branch code is required.");
        RuleFor(x => x.Location).NotEmpty().MaximumLength(200).WithMessage("Location is required.");
    }
}
