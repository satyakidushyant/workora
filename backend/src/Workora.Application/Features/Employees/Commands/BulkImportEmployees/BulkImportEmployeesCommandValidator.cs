using FluentValidation;
using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;

using Workora.Application.Features.Employees.DTOs;
namespace Workora.Application.Features.Employees.Commands.BulkImportEmployees;

/// <summary>
/// Validator for <see cref="BulkImportEmployeesCommand"/>.
/// </summary>
public class BulkImportEmployeesCommandValidator : AbstractValidator<BulkImportEmployeesCommand>
{
    /// <summary>
    /// Initializes validation rules for BulkImportEmployeesCommand.
    /// </summary>
    public BulkImportEmployeesCommandValidator()
    {
        RuleFor(x => x.Employees)
            .NotEmpty().WithMessage("Employee bulk import list cannot be empty.");
    }
}
