using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.Commands.UpdateHoliday;

/// <summary>
/// Validator for <see cref="UpdateHolidayCommand"/>.
/// </summary>
public class UpdateHolidayCommandValidator : AbstractValidator<UpdateHolidayCommand>
{
    /// <summary>
    /// Initializes validation rules for updating a holiday.
    /// </summary>
    public UpdateHolidayCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid holiday ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150).WithMessage("Holiday name is required.");
    }
}
