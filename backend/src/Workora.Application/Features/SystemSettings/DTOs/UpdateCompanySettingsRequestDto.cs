using Workora.Shared.Responses;

namespace Workora.Application.Features.SystemSettings.DTOs;

/// <summary>
/// Request payload for updating batch company settings.
/// </summary>
public record UpdateCompanySettingsRequestDto(
    int CompanyId,
    IReadOnlyList<SettingItemDto> Settings);
