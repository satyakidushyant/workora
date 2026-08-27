using FluentValidation;

using Workora.Application.Features.Holidays.DTOs;
namespace Workora.Application.Features.Holidays.Commands.DeleteHoliday;

/// <summary>
/// Validator for <see cref="DeleteHolidayCommand"/>.
/// </summary>
public class DeleteHolidayCommandValidator : AbstractValidator<DeleteHolidayCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="DeleteHolidayCommand"/>.
    /// </summary>
    public DeleteHolidayCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
