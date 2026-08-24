using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for salary structures and employee salary mappings.
/// </summary>
public class SalaryStructureRepository : GenericRepository<SalaryStructure>, ISalaryStructureRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="SalaryStructureRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public SalaryStructureRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<SalaryStructure>> GetByCompanyIdAsync(int companyId, CancellationToken ct = default)
    {
        return await _dbContext.Set<SalaryStructure>()
            .AsNoTracking()
            .Include(s => s.Components)
            .Where(s => s.CompanyId == companyId)
            .OrderBy(s => s.Name)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<SalaryStructure?> GetWithComponentsAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<SalaryStructure>()
            .Include(s => s.Components)
            .FirstOrDefaultAsync(s => s.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<EmployeeSalaryAssignment?> GetActiveEmployeeAssignmentAsync(int employeeId, DateOnly? date = null, CancellationToken ct = default)
    {
        var targetDate = date ?? DateOnly.FromDateTime(DateTime.UtcNow);
        return await _dbContext.Set<EmployeeSalaryAssignment>()
            .Include(a => a.SalaryStructure)
            .ThenInclude(s => s.Components)
            .Where(a => a.EmployeeId == employeeId &&
                        a.EffectiveFrom <= targetDate &&
                        (!a.EffectiveTo.HasValue || a.EffectiveTo.Value >= targetDate) &&
                        a.IsActive)
            .OrderByDescending(a => a.EffectiveFrom)
            .FirstOrDefaultAsync(ct);
    }

    /// <inheritdoc />
    public async Task AssignStructureAsync(EmployeeSalaryAssignment assignment, CancellationToken ct = default)
    {
        await _dbContext.Set<EmployeeSalaryAssignment>().AddAsync(assignment, ct);
    }
}
