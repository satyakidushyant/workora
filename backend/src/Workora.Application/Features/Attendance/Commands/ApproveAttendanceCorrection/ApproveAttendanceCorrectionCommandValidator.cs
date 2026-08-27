using FluentValidation;

using Workora.Application.Features.Attendance.DTOs;
namespace Workora.Application.Features.Attendance.Commands.ApproveAttendanceCorrection;

/// <summary>
/// Validator for <see cref="ApproveAttendanceCorrectionCommand"/>.
/// </summary>
public class ApproveAttendanceCorrectionCommandValidator : AbstractValidator<ApproveAttendanceCorrectionCommand>
{
    /// <summary>
    /// Initializes validation rules for <see cref="ApproveAttendanceCorrectionCommand"/>.
    /// </summary>
    public ApproveAttendanceCorrectionCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid Id is required.");
    }
}
