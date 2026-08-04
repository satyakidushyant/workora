using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="Permission"/> reference entities.
/// </summary>
public class PermissionRepository : GenericRepository<Permission>, IPermissionRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="PermissionRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public PermissionRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public override async Task<IReadOnlyList<Permission>> GetAllAsync(CancellationToken ct = default)

    {
        return await _dbContext.Permissions
            .AsNoTracking()
            .OrderBy(p => p.Module)
            .ThenBy(p => p.Name)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Permission>> GetByIdsAsync(IEnumerable<int> ids, CancellationToken ct = default)
    {
        var idList = ids.Distinct().ToList();
        return await _dbContext.Permissions
            .Where(p => idList.Contains(p.Id))
            .ToListAsync(ct);
    }
}
