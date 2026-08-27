using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.TransferEmployee;

/// <summary>
/// Validator for <see cref="TransferEmployeeCommand"/>.
/// </summary>
public class TransferEmployeeCommandValidator : AbstractValidator<TransferEmployeeCommand>
{
    /// <summary>
    /// Initializes validation rules for employee transfer.
    /// </summary>
    public TransferEmployeeCommandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.DepartmentId).GreaterThan(0).WithMessage("Valid department ID is required.");
        RuleFor(x => x.DesignationId).GreaterThan(0).WithMessage("Valid designation ID is required.");
        RuleFor(x => x.BranchId).GreaterThan(0).WithMessage("Valid branch ID is required.");
    }
}
