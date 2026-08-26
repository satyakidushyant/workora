using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="User"/> entities.
/// </summary>
public class UserRepository : GenericRepository<User>, IUserRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="UserRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public UserRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public override async Task<User?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                    .ThenInclude(r => r.RolePermissions)
                        .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(u => u.Id == id, ct);
    }

    /// <inheritdoc />
    public override async Task<User?> GetByUuidAsync(Guid uuid, CancellationToken ct = default)
    {
        return await _dbContext.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                    .ThenInclude(r => r.RolePermissions)
                        .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(u => u.Uuid == uuid, ct);
    }

    /// <inheritdoc />
    public async Task<User?> GetByEmailAsync(EmailAddress email, CancellationToken ct = default)
    {
        return await _dbContext.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                    .ThenInclude(r => r.RolePermissions)
                        .ThenInclude(rp => rp.Permission)
            .FirstOrDefaultAsync(u => u.Email == email, ct);
    }

    /// <inheritdoc />
    public async Task<bool> IsEmailUniqueAsync(EmailAddress email, CancellationToken ct = default)
    {
        return !await _dbContext.Users.AnyAsync(u => u.Email == email, ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<User>> GetPagedListAsync(int pageNumber, int pageSize, string? searchTerm = null, bool? isActive = null, int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .AsNoTracking()
            .AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(u => u.EmployeeId.HasValue &&
                _dbContext.Employees.Any(e => e.Id == u.EmployeeId.Value &&
                    ((e.Department != null && e.Department.CompanyId == companyId.Value) ||
                     (e.Branch != null && e.Branch.CompanyId == companyId.Value))));
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(u => u.FirstName.ToLower().Contains(term) ||
                                     u.LastName.ToLower().Contains(term) ||
                                     EF.Property<string>(u, "Email").ToLower().Contains(term));
        }

        if (isActive.HasValue)
        {
            query = query.Where(u => u.IsActive == isActive.Value);
        }

        return await query
            .OrderBy(u => u.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetCountAsync(string? searchTerm = null, bool? isActive = null, int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Users.AsNoTracking().AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(u => u.EmployeeId.HasValue &&
                _dbContext.Employees.Any(e => e.Id == u.EmployeeId.Value &&
                    ((e.Department != null && e.Department.CompanyId == companyId.Value) ||
                     (e.Branch != null && e.Branch.CompanyId == companyId.Value))));
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(u => u.FirstName.ToLower().Contains(term) ||
                                     u.LastName.ToLower().Contains(term) ||
                                     EF.Property<string>(u, "Email").ToLower().Contains(term));
        }

        if (isActive.HasValue)
        {
            query = query.Where(u => u.IsActive == isActive.Value);
        }

        return await query.CountAsync(ct);
    }

    /// <inheritdoc />
    public async Task<bool> HasOtherSuperAdminAsync(int excludeUserId, CancellationToken ct = default)
    {
        return await _dbContext.Users.AnyAsync(u => u.Id != excludeUserId && u.IsActive, ct);
    }

    /// <inheritdoc />
    public async Task AssignUserRolesAsync(int userId, IEnumerable<int> roleIds, CancellationToken ct = default)
    {
        var existingUserRoles = await _dbContext.UserRoles
            .Where(ur => ur.UserId == userId)
            .ToListAsync(ct);

        _dbContext.UserRoles.RemoveRange(existingUserRoles);

        var validRoleIds = await _dbContext.Roles
            .Where(r => roleIds.Contains(r.Id))
            .Select(r => r.Id)
            .ToListAsync(ct);

        var newUserRoles = validRoleIds
            .Select(rId => UserRole.Create(userId, rId))
            .ToList();

        await _dbContext.UserRoles.AddRangeAsync(newUserRoles, ct);
    }
}
