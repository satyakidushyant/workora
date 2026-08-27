using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Commands.CreateLeaveType;

/// <summary>
/// Validator for <see cref="CreateLeaveTypeCommand"/>.
/// </summary>
public class CreateLeaveTypeCommandValidator : AbstractValidator<CreateLeaveTypeCommand>
{
    /// <summary>
    /// Initializes validation rules for creating a leave type.
    /// </summary>
    public CreateLeaveTypeCommandValidator()
    {
        RuleFor(x => x.CompanyId).GreaterThan(0).WithMessage("Valid company ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100).WithMessage("Leave type name is required.");
        RuleFor(x => x.Code).NotEmpty().MaximumLength(50).WithMessage("Leave type code is required.");
        RuleFor(x => x.AnnualQuota).GreaterThanOrEqualTo(0).WithMessage("Annual quota cannot be negative.");
    }
}
