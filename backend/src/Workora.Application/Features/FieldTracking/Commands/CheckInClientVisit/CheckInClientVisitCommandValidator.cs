using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.FieldTracking.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FieldTracking.Commands.CheckInClientVisit;

/// <summary>
/// Validator for <see cref="CheckInClientVisitCommand"/>.
/// </summary>
public class CheckInClientVisitCommandValidator : AbstractValidator<CheckInClientVisitCommand>
{
    /// <summary>
    /// Initializes validation rules.
    /// </summary>
    public CheckInClientVisitCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid EmployeeId is required.");
        RuleFor(x => x.ClientName).NotEmpty().MaximumLength(150).WithMessage("Client name is required.");
        RuleFor(x => x.VisitPurpose).NotEmpty().MaximumLength(250).WithMessage("Visit purpose is required.");
        RuleFor(x => x.Address).NotEmpty().MaximumLength(300).WithMessage("Address is required.");
    }
}
