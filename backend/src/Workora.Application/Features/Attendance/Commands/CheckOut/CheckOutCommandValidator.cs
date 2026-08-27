using FluentValidation;

using Workora.Application.Features.Attendance.DTOs;
namespace Workora.Application.Features.Attendance.Commands.CheckOut;

/// <summary>
/// Validator for <see cref="CheckOutCommand"/>.
/// </summary>
public class CheckOutCommandValidator : AbstractValidator<CheckOutCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="CheckOutCommand"/>.
    /// </summary>
    public CheckOutCommandValidator()
    {
    }
}
