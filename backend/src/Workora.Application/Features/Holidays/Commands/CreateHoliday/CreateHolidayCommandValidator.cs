using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.Commands.CreateHoliday;

/// <summary>
/// Validator for <see cref="CreateHolidayCommand"/>.
/// </summary>
public class CreateHolidayCommandValidator : AbstractValidator<CreateHolidayCommand>
{
    /// <summary>
    /// Initializes validation rules for creating a holiday.
    /// </summary>
    public CreateHolidayCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150).WithMessage("Holiday name is required.");
    }
}
