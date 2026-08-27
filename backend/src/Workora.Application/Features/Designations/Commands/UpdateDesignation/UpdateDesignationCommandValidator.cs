using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Designations.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Designations.Commands.UpdateDesignation;

/// <summary>
/// Validator for <see cref="UpdateDesignationCommand"/>.
/// </summary>
public class UpdateDesignationCommandValidator : AbstractValidator<UpdateDesignationCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="UpdateDesignationCommand"/>.
    /// </summary>
    public UpdateDesignationCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid designation ID is required.");
        RuleFor(x => x.DepartmentId).GreaterThan(0).WithMessage("Valid department ID is required.");
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200).WithMessage("Title is required.");
        RuleFor(x => x.Level).GreaterThan(0).WithMessage("Level must be greater than 0.");
    }
}
