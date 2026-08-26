using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="Company"/> entities.
/// </summary>
public class CompanyRepository : GenericRepository<Company>, ICompanyRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="CompanyRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public CompanyRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<Company?> GetDefaultCompanyAsync(CancellationToken ct = default)
    {
        return await _dbContext.Companies
            .Include(c => c.Branches)
            .Include(c => c.Departments)
            .OrderBy(c => c.Id)
            .FirstOrDefaultAsync(ct);
    }

    /// <inheritdoc />
    public async Task<bool> IsCodeUniqueAsync(string code, int? excludeId = null, CancellationToken ct = default)
    {
        var normalizedCode = code.Trim().ToUpperInvariant();
        return !await _dbContext.Companies
            .AnyAsync(c => c.Code == normalizedCode && (!excludeId.HasValue || c.Id != excludeId.Value), ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Company>> GetAllCompaniesAsync(CancellationToken ct = default)
    {
        return await _dbContext.Companies
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .ToListAsync(ct);
    }
}
