using FluentValidation;

using Workora.Application.Features.Attendance.DTOs;
namespace Workora.Application.Features.Attendance.Commands.CheckIn;

/// <summary>
/// Validator for <see cref="CheckInCommand"/>.
/// </summary>
public class CheckInCommandValidator : AbstractValidator<CheckInCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="CheckInCommand"/>.
    /// </summary>
    public CheckInCommandValidator()
    {
    }
}
