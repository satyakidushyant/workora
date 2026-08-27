using FluentValidation;

using Workora.Application.Features.Attendance.DTOs;
namespace Workora.Application.Features.Attendance.Commands.RejectAttendanceCorrection;

/// <summary>
/// Validator for <see cref="RejectAttendanceCorrectionCommand"/>.
/// </summary>
public class RejectAttendanceCorrectionCommandValidator : AbstractValidator<RejectAttendanceCorrectionCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="RejectAttendanceCorrectionCommand"/>.
    /// </summary>
    public RejectAttendanceCorrectionCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
