using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="Department"/> entities.
/// </summary>
public class DepartmentRepository : GenericRepository<Department>, IDepartmentRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DepartmentRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public DepartmentRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Department>> GetByCompanyIdAsync(int companyId, CancellationToken ct = default)
    {
        return await _dbContext.Departments
            .AsNoTracking()
            .Where(d => d.CompanyId == companyId)
            .OrderBy(d => d.Name)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<bool> IsCodeUniqueAsync(int companyId, string code, int? excludeId = null, CancellationToken ct = default)
    {
        var normalizedCode = code.Trim().ToUpperInvariant();
        return !await _dbContext.Departments
            .AnyAsync(d => d.CompanyId == companyId && d.Code == normalizedCode && (!excludeId.HasValue || d.Id != excludeId.Value), ct);
    }

    /// <inheritdoc />
    public async Task<Department?> GetWithDetailsAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Departments
            .Include(d => d.Company)
            .Include(d => d.ParentDepartment)
            .Include(d => d.SubDepartments)
            .Include(d => d.Designations)
            .FirstOrDefaultAsync(d => d.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Department>> GetPagedListAsync(int pageNumber, int pageSize, string? searchTerm = null, int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Departments
            .AsNoTracking()
            .Include(d => d.Company)
            .Include(d => d.ParentDepartment)
            .Include(d => d.Designations)
            .AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(d => d.CompanyId == companyId.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(d => d.Name.ToLower().Contains(term) || d.Code.ToLower().Contains(term));
        }

        return await query
            .OrderBy(d => d.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetCountAsync(string? searchTerm = null, int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Departments.AsNoTracking().AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(d => d.CompanyId == companyId.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(d => d.Name.ToLower().Contains(term) || d.Code.ToLower().Contains(term));
        }

        return await query.CountAsync(ct);
    }
}
