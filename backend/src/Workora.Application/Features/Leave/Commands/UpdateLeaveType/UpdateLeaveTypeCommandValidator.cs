using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Commands.UpdateLeaveType;

/// <summary>
/// Validator for <see cref="UpdateLeaveTypeCommand"/>.
/// </summary>
public class UpdateLeaveTypeCommandValidator : AbstractValidator<UpdateLeaveTypeCommand>
{
    /// <summary>
    /// Initializes validation rules for updating a leave type.
    /// </summary>
    public UpdateLeaveTypeCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid leave type ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100).WithMessage("Leave type name is required.");
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50).WithMessage("Leave type code is required.");
    }
}
