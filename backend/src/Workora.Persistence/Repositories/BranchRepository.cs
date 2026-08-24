using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="Branch"/> entities.
/// </summary>
public class BranchRepository : GenericRepository<Branch>, IBranchRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="BranchRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public BranchRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Branch>> GetByCompanyIdAsync(int companyId, CancellationToken ct = default)
    {
        return await _dbContext.Branches
            .AsNoTracking()
            .Where(b => b.CompanyId == companyId)
            .OrderBy(b => b.Name)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<bool> IsCodeUniqueAsync(int companyId, string code, int? excludeId = null, CancellationToken ct = default)
    {
        var normalizedCode = code.Trim().ToUpperInvariant();
        return !await _dbContext.Branches
            .AnyAsync(b => b.CompanyId == companyId && b.Code == normalizedCode && (!excludeId.HasValue || b.Id != excludeId.Value), ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Branch>> GetPagedListAsync(int pageNumber, int pageSize, string? searchTerm = null, bool? isActive = null, CancellationToken ct = default)
    {
        var query = _dbContext.Branches.AsNoTracking().Include(b => b.Company).AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(b => b.Name.ToLower().Contains(term) ||
                                     b.Code.ToLower().Contains(term) ||
                                     b.Location.ToLower().Contains(term));
        }

        if (isActive.HasValue)
        {
            query = query.Where(b => b.IsActive == isActive.Value);
        }

        return await query
            .OrderBy(b => b.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetCountAsync(string? searchTerm = null, bool? isActive = null, CancellationToken ct = default)
    {
        var query = _dbContext.Branches.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(b => b.Name.ToLower().Contains(term) ||
                                     b.Code.ToLower().Contains(term) ||
                                     b.Location.ToLower().Contains(term));
        }

        if (isActive.HasValue)
        {
            query = query.Where(b => b.IsActive == isActive.Value);
        }

        return await query.CountAsync(ct);
    }
}
