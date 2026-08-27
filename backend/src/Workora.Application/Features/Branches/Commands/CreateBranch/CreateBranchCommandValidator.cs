using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Branches.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.Commands.CreateBranch;

/// <summary>
/// Validator for <see cref="CreateBranchCommand"/>.
/// </summary>
public class CreateBranchCommandValidator : AbstractValidator<CreateBranchCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="CreateBranchCommand"/>.
    /// </summary>
    public CreateBranchCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200).WithMessage("Branch name is required and cannot exceed 200 characters.");
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50).WithMessage("Branch code is required and cannot exceed 50 characters.");
        RuleFor(x => x.Location).NotEmpty().MaximumLength(200).WithMessage("Location is required.");
    }
}
