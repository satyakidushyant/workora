using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="Holiday"/> entities.
/// </summary>
public class HolidayRepository : GenericRepository<Holiday>, IHolidayRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="HolidayRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public HolidayRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Holiday>> GetHolidaysAsync(int year, int? branchId = null, int? companyId = null, CancellationToken ct = default)
    {
        var start = new DateOnly(year, 1, 1);
        var end = new DateOnly(year, 12, 31);

        var query = _dbContext.Set<Holiday>()
            .AsNoTracking()
            .Include(h => h.Branch)
            .Where(h => h.Date >= start && h.Date <= end);

        if (companyId.HasValue)
        {
            query = query.Where(h => h.CompanyId == companyId.Value);
        }

        if (branchId.HasValue)
        {
            query = query.Where(h => h.BranchId == null || h.BranchId == branchId.Value);
        }

        return await query.OrderBy(h => h.Date).ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<bool> IsDateUniqueAsync(int companyId, DateOnly date, int? branchId = null, int? excludeId = null, CancellationToken ct = default)
    {
        return !await _dbContext.Set<Holiday>()
            .AnyAsync(h => h.CompanyId == companyId &&
                           h.Date == date &&
                           h.BranchId == branchId &&
                           (!excludeId.HasValue || h.Id != excludeId.Value), ct);
    }
}
