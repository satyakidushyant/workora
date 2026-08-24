using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for policies and acknowledgments.
/// </summary>
public class PolicyRepository : GenericRepository<Policy>, IPolicyRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="PolicyRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public PolicyRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Policy>> GetPoliciesPagedAsync(int pageNumber, int pageSize, int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<Policy>()
            .AsNoTracking()
            .Include(p => p.Acknowledgments)
            .AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(p => p.CompanyId == companyId.Value);
        }

        return await query
            .OrderBy(p => p.Title)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetPoliciesCountAsync(int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<Policy>().AsNoTracking().AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(p => p.CompanyId == companyId.Value);
        }

        return await query.CountAsync(ct);
    }

    /// <inheritdoc />
    public async Task<Policy?> GetWithAcknowledgmentsAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<Policy>()
            .Include(p => p.Acknowledgments)
            .ThenInclude(a => a.Employee)
            .FirstOrDefaultAsync(p => p.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<bool> HasAcknowledgedAsync(int policyId, int employeeId, CancellationToken ct = default)
    {
        return await _dbContext.Set<PolicyAcknowledgment>()
            .AnyAsync(a => a.PolicyId == policyId && a.EmployeeId == employeeId, ct);
    }

    /// <inheritdoc />
    public async Task AddAcknowledgmentAsync(PolicyAcknowledgment acknowledgment, CancellationToken ct = default)
    {
        await _dbContext.Set<PolicyAcknowledgment>().AddAsync(acknowledgment, ct);
    }
}
