using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for company configuration parameters.
/// </summary>
public interface ISystemSettingRepository : IRepository<SystemSetting>
{
    /// <summary>
    /// Gets all settings for a company.
    /// </summary>
    Task<IReadOnlyList<SystemSetting>> GetCompanySettingsAsync(int companyId, string? group = null, CancellationToken ct = default);

    /// <summary>
    /// Gets a specific setting by key.
    /// </summary>
    Task<SystemSetting?> GetByKeyAsync(int companyId, string key, CancellationToken ct = default);

    /// <summary>
    /// Upserts a configuration setting.
    /// </summary>
    Task UpsertSettingAsync(int companyId, string key, string value, string? description = null, string group = "General", CancellationToken ct = default);
}
