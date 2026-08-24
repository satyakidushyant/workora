using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="Shift"/> operations.
/// </summary>
public class ShiftRepository : GenericRepository<Shift>, IShiftRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="ShiftRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public ShiftRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Shift>> GetByCompanyIdAsync(int companyId, CancellationToken ct = default)
    {
        return await _dbContext.Set<Shift>()
            .AsNoTracking()
            .Where(s => s.CompanyId == companyId)
            .OrderBy(s => s.Name)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<bool> IsCodeUniqueAsync(int companyId, string code, int? excludeId = null, CancellationToken ct = default)
    {
        var norm = code.Trim().ToUpperInvariant();
        return !await _dbContext.Set<Shift>()
            .AnyAsync(s => s.CompanyId == companyId && s.Code == norm && (!excludeId.HasValue || s.Id != excludeId.Value), ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Shift>> GetPagedListAsync(int pageNumber, int pageSize, string? searchTerm = null, int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<Shift>().AsNoTracking().AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(s => s.CompanyId == companyId.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(s => s.Name.ToLower().Contains(term) || s.Code.ToLower().Contains(term));
        }

        return await query
            .OrderBy(s => s.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetCountAsync(string? searchTerm = null, int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<Shift>().AsNoTracking().AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(s => s.CompanyId == companyId.Value);
        }

        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            var term = searchTerm.Trim().ToLower();
            query = query.Where(s => s.Name.ToLower().Contains(term) || s.Code.ToLower().Contains(term));
        }

        return await query.CountAsync(ct);
    }

    /// <inheritdoc />
    public async Task<EmployeeShiftAssignment?> GetActiveAssignmentAsync(int employeeId, DateOnly date, CancellationToken ct = default)
    {
        return await _dbContext.Set<EmployeeShiftAssignment>()
            .Include(a => a.Shift)
            .Where(a => a.EmployeeId == employeeId &&
                        a.EffectiveFrom <= date &&
                        (!a.EffectiveTo.HasValue || a.EffectiveTo.Value >= date) &&
                        a.IsActive)
            .OrderByDescending(a => a.EffectiveFrom)
            .FirstOrDefaultAsync(ct);
    }

    /// <inheritdoc />
    public async Task AssignShiftAsync(EmployeeShiftAssignment assignment, CancellationToken ct = default)
    {
        await _dbContext.Set<EmployeeShiftAssignment>().AddAsync(assignment, ct);
    }
}
