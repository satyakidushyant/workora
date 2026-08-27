using Workora.Shared.Responses;

namespace Workora.Application.Features.Compliance.DTOs;

/// <summary>
/// Data transfer object for employee Income Tax declaration (80C, 80D, HRA).
/// </summary>
public record TaxDeclarationDto(
    int EmployeeId,
    string FinancialYear,
    decimal Section80CAmount,
    decimal Section80DAmount,
    decimal HraRentPaidAnnual,
    decimal HomeLoanInterest,
    decimal OtherExemptions,
    DateTimeOffset DeclaredAt);
