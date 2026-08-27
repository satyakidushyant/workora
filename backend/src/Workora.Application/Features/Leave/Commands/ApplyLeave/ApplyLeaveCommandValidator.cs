using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Commands.ApplyLeave;

/// <summary>
/// Validator for <see cref="ApplyLeaveCommand"/>.
/// </summary>
public class ApplyLeaveCommandValidator : AbstractValidator<ApplyLeaveCommand>
{
    /// <summary>
    /// Initializes validation rules for applying for leave.
    /// </summary>
    public ApplyLeaveCommandValidator()
    {
        RuleFor(x => x.LeaveTypeId).GreaterThan(0).WithMessage("Valid leave type ID is required.");
        RuleFor(x => x.DaysCount).GreaterThan(0).WithMessage("Leave duration must be greater than zero.");
        RuleFor(x => x.Reason).NotEmpty().MaximumLength(500).WithMessage("Reason is required.");
        RuleFor(x => x.EndDate).Must((cmd, end) => end >= cmd.StartDate).WithMessage("End date must be on or after start date.");
    }
}
