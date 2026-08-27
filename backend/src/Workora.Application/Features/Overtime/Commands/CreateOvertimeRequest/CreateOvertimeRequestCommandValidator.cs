using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Overtime.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Overtime.Commands.CreateOvertimeRequest;

/// <summary>
/// Validator for <see cref="CreateOvertimeRequestCommand"/>.
/// </summary>
public class CreateOvertimeRequestCommandValidator : AbstractValidator<CreateOvertimeRequestCommand>
{
    /// <summary>
    /// Initializes validation rules for creating an overtime request.
    /// </summary>
    public CreateOvertimeRequestCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.OvertimeDate).NotEmpty().WithMessage("Overtime date is required.");
        RuleFor(x => x.StartTime).NotEmpty().WithMessage("Start time is required.");
        RuleFor(x => x.EndTime).NotEmpty().WithMessage("End time is required.");
        RuleFor(x => x.EndTime).GreaterThan(x => x.StartTime).WithMessage("End time must be after start time.");
        RuleFor(x => x.HoursRequested).GreaterThan(0).WithMessage("Hours requested must be greater than zero.");
        RuleFor(x => x.HoursRequested).LessThanOrEqualTo(24).WithMessage("Hours requested cannot exceed 24.");
        RuleFor(x => x.Reason).NotEmpty().MaximumLength(500).WithMessage("Reason is required and cannot exceed 500 characters.");
    }
}
