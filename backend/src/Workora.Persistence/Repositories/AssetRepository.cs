using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for assets and equipment checkouts.
/// </summary>
public class AssetRepository : GenericRepository<Asset>, IAssetRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="AssetRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public AssetRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Asset>> GetAssetsPagedAsync(int pageNumber, int pageSize, int? companyId = null, string? category = null, AssetStatus? status = null, string? searchTerm = null, CancellationToken ct = default)
    {
        var query = BuildAssetQuery(companyId, category, status, searchTerm);

        return await query
            .OrderBy(a => a.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetAssetsCountAsync(int? companyId = null, string? category = null, AssetStatus? status = null, string? searchTerm = null, CancellationToken ct = default)
    {
        var query = BuildAssetQuery(companyId, category, status, searchTerm);
        return await query.CountAsync(ct);
    }

    /// <inheritdoc />
    public async Task<Asset?> GetWithAssignmentsAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<Asset>()
            .Include(a => a.Assignments)
            .ThenInclude(ass => ass.Employee)
            .FirstOrDefaultAsync(a => a.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<AssetAssignment?> GetActiveAssignmentAsync(int assetId, CancellationToken ct = default)
    {
        return await _dbContext.Set<AssetAssignment>()
            .Include(a => a.Employee)
            .Include(a => a.Asset)
            .Where(a => a.AssetId == assetId && a.IsActive && !a.ReturnedDate.HasValue)
            .OrderByDescending(a => a.AssignedDate)
            .FirstOrDefaultAsync(ct);
    }

    /// <inheritdoc />
    public async Task AddAssignmentAsync(AssetAssignment assignment, CancellationToken ct = default)
    {
        await _dbContext.Set<AssetAssignment>().AddAsync(assignment, ct);
    }

    /// <inheritdoc />
    public void UpdateAssignment(AssetAssignment assignment)
    {
        _dbContext.Set<AssetAssignment>().Update(assignment);
    }

    private IQueryable<Asset> BuildAssetQuery(int? companyId, string? category, AssetStatus? status, string? searchTerm)
    {
        var query = _dbContext.Set<Asset>()
            .AsNoTracking()
            .Include(a => a.Assignments)
            .AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(a => a.CompanyId == companyId.Value);
        }

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(a => a.Category == category);
        }

        if (status.HasValue)
        {
            query = query.Where(a => a.Status == status.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(a => a.Name.ToLower().Contains(term) || a.AssetTag.ToLower().Contains(term));
        }

        return query;
    }
}
