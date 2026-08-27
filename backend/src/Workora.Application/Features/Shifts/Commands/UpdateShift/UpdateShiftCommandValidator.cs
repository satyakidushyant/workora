using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Shifts.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Shifts.Commands.UpdateShift;

/// <summary>
/// Validator for <see cref="UpdateShiftCommand"/>.
/// </summary>
public class UpdateShiftCommandValidator : AbstractValidator<UpdateShiftCommand>
{
    /// <summary>
    /// Initializes validation rules for updating a shift.
    /// </summary>
    public UpdateShiftCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid shift ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100).WithMessage("Shift name is required.");
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50).WithMessage("Shift code is required.");
    }
}
