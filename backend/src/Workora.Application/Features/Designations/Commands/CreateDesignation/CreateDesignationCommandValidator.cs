using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Designations.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Designations.Commands.CreateDesignation;

/// <summary>
/// Validator for <see cref="CreateDesignationCommand"/>.
/// </summary>
public class CreateDesignationCommandValidator : AbstractValidator<CreateDesignationCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="CreateDesignationCommand"/>.
    /// </summary>
    public CreateDesignationCommandValidator()
    {
        RuleFor(x => x.DepartmentId).GreaterThan(0).WithMessage("Valid department ID is required.");
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200).WithMessage("Title is required.");
        RuleFor(x => x.Level).GreaterThan(0).WithMessage("Level must be greater than 0.");
    }
}
