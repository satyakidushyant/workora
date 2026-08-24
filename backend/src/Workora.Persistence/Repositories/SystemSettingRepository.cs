using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for system settings.
/// </summary>
public class SystemSettingRepository : GenericRepository<SystemSetting>, ISystemSettingRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="SystemSettingRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public SystemSettingRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<SystemSetting>> GetCompanySettingsAsync(int companyId, string? group = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<SystemSetting>()
            .AsNoTracking()
            .Where(s => s.CompanyId == companyId);

        if (!string.IsNullOrWhiteSpace(group))
        {
            query = query.Where(s => s.Group == group);
        }

        return await query.OrderBy(s => s.Group).ThenBy(s => s.Key).ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<SystemSetting?> GetByKeyAsync(int companyId, string key, CancellationToken ct = default)
    {
        return await _dbContext.Set<SystemSetting>()
            .FirstOrDefaultAsync(s => s.CompanyId == companyId && s.Key == key, ct);
    }

    /// <inheritdoc />
    public async Task UpsertSettingAsync(int companyId, string key, string value, string? description = null, string group = "General", CancellationToken ct = default)
    {
        var existing = await _dbContext.Set<SystemSetting>()
            .FirstOrDefaultAsync(s => s.CompanyId == companyId && s.Key == key, ct);

        if (existing != null)
        {
            existing.UpdateValue(value);
            _dbContext.Set<SystemSetting>().Update(existing);
        }
        else
        {
            var setting = SystemSetting.Create(companyId, key, value, description, group);
            await _dbContext.Set<SystemSetting>().AddAsync(setting, ct);
        }
    }
}
