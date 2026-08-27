using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Employees.DTOs;
namespace Workora.Application.Features.Employees.Commands.UpsertEmergencyContact;

/// <summary>
/// Validator for <see cref="UpsertEmergencyContactCommand"/>.
/// </summary>
public class UpsertEmergencyContactCommandValidator : AbstractValidator<UpsertEmergencyContactCommand>
{
    /// <summary>
    /// Initializes validation rules for emergency contacts.
    /// </summary>
    public UpsertEmergencyContactCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150).WithMessage("Contact name is required.");
        RuleFor(x => x.Relationship).NotEmpty().MaximumLength(100).WithMessage("Relationship is required.");
        RuleFor(x => x.PhoneNumber).NotEmpty().MaximumLength(50).WithMessage("Phone number is required.");
    }
}
