using Workora.Shared.Responses;

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
