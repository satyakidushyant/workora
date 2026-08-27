using Workora.Shared.Responses;

namespace Workora.Application.Features.Companies.DTOs;

/// <summary>
/// Data transfer object for updating the company profile.
/// </summary>
public record UpdateCompanyProfileRequestDto(
    string Name,
    string? RegistrationNumber,
    string? TaxId,
    string? Email,
    string? Phone,
    string? Website,
    int FiscalYearStartMonth,
    string Currency,
    string? Address);
