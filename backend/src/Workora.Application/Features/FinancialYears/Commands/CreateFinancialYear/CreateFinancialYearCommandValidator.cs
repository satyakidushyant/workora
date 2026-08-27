using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.FinancialYears.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.FinancialYears.Commands.CreateFinancialYear;

/// <summary>
/// Validator for <see cref="CreateFinancialYearCommand"/>.
/// </summary>
public class CreateFinancialYearCommandValidator : AbstractValidator<CreateFinancialYearCommand>
{
    /// <summary>
    /// Initializes validation rules for creating a financial year.
    /// </summary>
    public CreateFinancialYearCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(50).WithMessage("Name is required and cannot exceed 50 characters.");
        RuleFor(x => x.EndDate).GreaterThan(x => x.StartDate).WithMessage("End date must be after start date.");
    }
}
