using FluentValidation;
using MediatR;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Commands.BulkImportAttendance;

/// <summary>
/// Validator for <see cref="BulkImportAttendanceCommand"/>.
/// </summary>
public class BulkImportAttendanceCommandValidator : AbstractValidator<BulkImportAttendanceCommand>
{
    /// <summary>
    /// Initializes validation rules for bulk attendance import.
    /// </summary>
    public BulkImportAttendanceCommandValidator()
    {
        RuleFor(x => x.Records).NotEmpty().WithMessage("At least one attendance record must be provided.");
    }
}
