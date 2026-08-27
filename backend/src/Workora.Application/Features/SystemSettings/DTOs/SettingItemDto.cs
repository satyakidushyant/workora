using Workora.Shared.Responses;

namespace Workora.Application.Features.SystemSettings.DTOs;

/// <summary>
/// Request payload for setting item.
/// </summary>
public record SettingItemDto(
    string Key,
    string Value,
    string? Description,
    string Group);
