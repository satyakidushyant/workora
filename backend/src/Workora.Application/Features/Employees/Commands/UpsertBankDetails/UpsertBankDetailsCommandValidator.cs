using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Employees.DTOs;
namespace Workora.Application.Features.Employees.Commands.UpsertBankDetails;

/// <summary>
/// Validator for <see cref="UpsertBankDetailsCommand"/>.
/// </summary>
public class UpsertBankDetailsCommandValidator : AbstractValidator<UpsertBankDetailsCommand>
{
    /// <summary>
    /// Initializes validation rules for bank details.
    /// </summary>
    public UpsertBankDetailsCommandValidator()
    {
        RuleFor(x => x.EmployeeId).GreaterThan(0).WithMessage("Valid employee ID is required.");
        RuleFor(x => x.BankName).NotEmpty().MaximumLength(150).WithMessage("Bank name is required.");
        RuleFor(x => x.AccountNumber).NotEmpty().MaximumLength(100).WithMessage("Account number is required.");
        RuleFor(x => x.AccountHolderName).NotEmpty().MaximumLength(150).WithMessage("Account holder name is required.");
    }
}
