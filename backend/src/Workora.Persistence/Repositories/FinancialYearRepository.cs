using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="FinancialYear"/> entity.
/// </summary>
public class FinancialYearRepository : GenericRepository<FinancialYear>, IFinancialYearRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="FinancialYearRepository"/> class.
    /// </summary>
    public FinancialYearRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<FinancialYear>> GetByCompanyIdAsync(int companyId, CancellationToken ct = default)
    {
        return await _dbContext.Set<FinancialYear>()
            .AsNoTracking()
            .OrderByDescending(fy => fy.StartDate)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<FinancialYear?> GetCurrentAsync(int companyId, CancellationToken ct = default)
    {
        return await _dbContext.Set<FinancialYear>()
            .FirstOrDefaultAsync(fy => fy.IsCurrent && fy.IsActive, ct);
    }

    /// <inheritdoc />
    public async Task<bool> ExistsByNameAsync(int companyId, string name, int? excludeId = null, CancellationToken ct = default)
    {
        return await _dbContext.Set<FinancialYear>()
            .AnyAsync(fy => fy.Name == name && fy.IsActive && (excludeId == null || fy.Id != excludeId), ct);
    }

    /// <inheritdoc />
    public async Task<bool> HasCurrentYearAsync(int companyId, CancellationToken ct = default)
    {
        return await _dbContext.Set<FinancialYear>()
            .AnyAsync(fy => fy.IsCurrent && fy.IsActive, ct);
    }
}