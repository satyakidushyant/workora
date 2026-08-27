using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Attendance.DTOs;
namespace Workora.Application.Features.Attendance.Commands.RequestAttendanceCorrection;

/// <summary>
/// Validator for <see cref="RequestAttendanceCorrectionCommand"/>.
/// </summary>
public class RequestAttendanceCorrectionCommandValidator : AbstractValidator<RequestAttendanceCorrectionCommand>
{
    /// <summary>
    /// Initializes validation rules for correction requests.
    /// </summary>
    public RequestAttendanceCorrectionCommandValidator()
    {
        RuleFor(x => x.AttendanceRecordId).GreaterThan(0).WithMessage("Valid attendance record ID is required.");
        RuleFor(x => x.Reason).NotEmpty().MaximumLength(500).WithMessage("Reason for correction is required.");
    }
}
