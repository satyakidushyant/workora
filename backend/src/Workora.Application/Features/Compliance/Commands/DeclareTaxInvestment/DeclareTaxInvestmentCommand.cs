using FluentValidation;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Compliance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Compliance.Commands.DeclareTaxInvestment;

/// <summary>
/// Command to declare tax saving investments under Sections 80C, 80D, HRA, etc.
/// </summary>
public record DeclareTaxInvestmentCommand(
    int EmployeeId,
    string FinancialYear,
    decimal Section80CAmount,
    decimal Section80DAmount,
    decimal HraRentPaidAnnual,
    decimal HomeLoanInterest,
    decimal OtherExemptions) : IRequest<ApiResponse<TaxDeclarationDto>>;
