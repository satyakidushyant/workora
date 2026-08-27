using Workora.Shared.Responses;

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
