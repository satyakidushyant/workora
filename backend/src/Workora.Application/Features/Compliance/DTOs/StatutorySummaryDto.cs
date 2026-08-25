namespace Workora.Application.Features.Compliance.DTOs;

/// <summary>
/// Aggregated summary of statutory contributions for a payroll month.
/// </summary>
public record StatutorySummaryDto(
    int Month,
    int Year,
    int EligibleEmployeesCount,
    decimal TotalEmployeePf,
    decimal TotalEmployerPf,
    decimal TotalEmployeeEsic,
    decimal TotalEmployerEsic,
    decimal TotalProfessionalTax,
    decimal TotalTdsDeducted,
    decimal TotalStatutoryRemittance);

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

/// <summary>
/// ECR or statutory filing text export representation.
/// </summary>
public record StatutoryExportFileDto(
    string FileName,
    string ContentType,
    string FileContentBase64);
