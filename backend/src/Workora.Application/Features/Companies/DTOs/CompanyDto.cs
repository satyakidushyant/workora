namespace Workora.Application.Features.Companies.DTOs;

/// <summary>
/// Data transfer object representing a company summary.
/// </summary>
public record CompanyDto(
    int Id,
    Guid Uuid,
    string Name,
    string Code,
    string? RegistrationNumber,
    string? TaxId,
    string? Email,
    string? Phone,
    string? Website,
    string? LogoUrl,
    int FiscalYearStartMonth,
    string Currency,
    string? Address,
    bool IsActive,
    DateTimeOffset CreatedAt);

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

/// <summary>
/// Data transfer object for uploading or setting the company logo.
/// </summary>
public record UploadCompanyLogoRequestDto(
    string LogoUrl);
