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
    public async Task<User?> GetByEmailAsync(EmailAddress email, CancellationToken ct = default)
    {
        return await _dbContext.Users.FirstOrDefaultAsync(u => u.Email == email, ct);
    }

    /// <inheritdoc />
    public async Task<bool> IsEmailUniqueAsync(EmailAddress email, CancellationToken ct = default)
    {
        return !await _dbContext.Users.AnyAsync(u => u.Email == email, ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<User>> GetPagedListAsync(int pageNumber, int pageSize, string? searchTerm = null, bool? isActive = null, CancellationToken ct = default)
    {
        var query = _dbContext.Users.AsNoTracking().AsQueryable();

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
    public async Task<int> GetCountAsync(string? searchTerm = null, bool? isActive = null, CancellationToken ct = default)
    {
        var query = _dbContext.Users.AsNoTracking().AsQueryable();

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
        // Checks if there are other users besides excludeUserId with active status
        return await _dbContext.Users.AnyAsync(u => u.Id != excludeUserId && u.IsActive, ct);
    }
}

