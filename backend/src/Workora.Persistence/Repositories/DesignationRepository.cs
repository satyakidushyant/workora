using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="Designation"/> entities.
/// </summary>
public class DesignationRepository : GenericRepository<Designation>, IDesignationRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DesignationRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public DesignationRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Designation>> GetByDepartmentIdAsync(int departmentId, CancellationToken ct = default)
    {
        return await _dbContext.Designations
            .AsNoTracking()
            .Where(d => d.DepartmentId == departmentId)
            .OrderBy(d => d.Level)
            .ThenBy(d => d.Title)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<bool> IsTitleUniqueAsync(int departmentId, string title, int? excludeId = null, CancellationToken ct = default)
    {
        var normalizedTitle = title.Trim().ToLower();
        return !await _dbContext.Designations
            .AnyAsync(d => d.DepartmentId == departmentId &&
                           d.Title.ToLower() == normalizedTitle &&
                           (!excludeId.HasValue || d.Id != excludeId.Value), ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Designation>> GetPagedListAsync(int pageNumber, int pageSize, string? searchTerm = null, int? departmentId = null, int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Designations
            .AsNoTracking()
            .Include(d => d.Department)
            .AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(d => d.Department != null && d.Department.CompanyId == companyId.Value);
        }

        if (departmentId.HasValue)
        {
            query = query.Where(d => d.DepartmentId == departmentId.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(d => d.Title.ToLower().Contains(term) || (d.Grade != null && d.Grade.ToLower().Contains(term)));
        }

        return await query
            .OrderBy(d => d.Level)
            .ThenBy(d => d.Title)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetCountAsync(string? searchTerm = null, int? departmentId = null, int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Designations
            .AsNoTracking()
            .Include(d => d.Department)
            .AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(d => d.Department != null && d.Department.CompanyId == companyId.Value);
        }

        if (departmentId.HasValue)
        {
            query = query.Where(d => d.DepartmentId == departmentId.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(d => d.Title.ToLower().Contains(term) || (d.Grade != null && d.Grade.ToLower().Contains(term)));
        }

        return await query.CountAsync(ct);
    }
}
