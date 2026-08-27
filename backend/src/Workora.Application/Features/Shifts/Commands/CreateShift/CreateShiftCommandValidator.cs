using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Shifts.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.Commands.CreateShift;

/// <summary>
/// Validator for <see cref="CreateShiftCommand"/>.
/// </summary>
public class CreateShiftCommandValidator : AbstractValidator<CreateShiftCommand>
{
    /// <summary>
    /// Initializes validation rules for creating a shift.
    /// </summary>
    public CreateShiftCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100).WithMessage("Shift name is required.");
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50).WithMessage("Shift code is required.");
    }
}
