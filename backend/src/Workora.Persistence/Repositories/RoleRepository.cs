using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="Role"/> entities.
/// </summary>
public class RoleRepository : GenericRepository<Role>, IRoleRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="RoleRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public RoleRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<Role?> GetByNameAsync(string name, CancellationToken ct = default)
    {
        var normalized = name.Trim().ToLower();
        return await _dbContext.Roles
            .Include(r => r.RolePermissions)
            .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(r => r.Name.ToLower() == normalized, ct);
    }

    /// <inheritdoc />
    public async Task<Role?> GetByIdWithPermissionsAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Roles
            .Include(r => r.RolePermissions)
            .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(r => r.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<bool> IsNameUniqueAsync(string name, int? excludeRoleId = null, CancellationToken ct = default)
    {
        var normalized = name.Trim().ToLower();
        var query = _dbContext.Roles.AsQueryable();

        if (excludeRoleId.HasValue)
        {
            query = query.Where(r => r.Id != excludeRoleId.Value);
        }

        return !await query.AnyAsync(r => r.Name.ToLower() == normalized, ct);
    }

    /// <inheritdoc />
    public async Task<bool> IsInUseAsync(int roleId, CancellationToken ct = default)
    {
        return await _dbContext.UserRoles.AnyAsync(ur => ur.RoleId == roleId, ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Role>> GetPagedListAsync(int pageNumber, int pageSize, string? searchTerm = null, CancellationToken ct = default)
    {
        var query = _dbContext.Roles
            .Include(r => r.UserRoles)
            .Include(r => r.RolePermissions)
            .AsNoTracking()
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(r => r.Name.ToLower().Contains(term) || (r.Description != null && r.Description.ToLower().Contains(term)));
        }

        return await query
            .OrderBy(r => r.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetCountAsync(string? searchTerm = null, CancellationToken ct = default)
    {
        var query = _dbContext.Roles.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(r => r.Name.ToLower().Contains(term) || (r.Description != null && r.Description.ToLower().Contains(term)));
        }

        return await query.CountAsync(ct);
    }

    /// <inheritdoc />
    public async Task SetRolePermissionsAsync(int roleId, IEnumerable<int> permissionIds, CancellationToken ct = default)
    {
        var existingRolePermissions = await _dbContext.RolePermissions
            .Where(rp => rp.RoleId == roleId)
            .ToListAsync(ct);

        _dbContext.RolePermissions.RemoveRange(existingRolePermissions);

        var validPermissionIds = await _dbContext.Permissions
            .Where(p => permissionIds.Contains(p.Id))
            .Select(p => p.Id)
            .ToListAsync(ct);

        var newRolePermissions = validPermissionIds
            .Select(pId => RolePermission.Create(roleId, pId))
            .ToList();

        await _dbContext.RolePermissions.AddRangeAsync(newRolePermissions, ct);
    }
}

