namespace Workora.Application.Features.SystemSettings.DTOs;

/// <summary>
/// DTO representing a system configuration setting.
/// </summary>
public record SystemSettingDto(
    int Id,
    int CompanyId,
    string Key,
    string Value,
    string? Description,
    string Group,
    bool IsActive);

/// <summary>
/// Request payload for setting item.
/// </summary>
public record SettingItemDto(
    string Key,
    string Value,
    string? Description,
    string Group);

/// <summary>
/// Request payload for updating batch company settings.
/// </summary>
public record UpdateCompanySettingsRequestDto(
    int CompanyId,
    IReadOnlyList<SettingItemDto> Settings);
