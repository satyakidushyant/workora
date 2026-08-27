using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="ExpenseClaim"/>.
/// </summary>
public class ExpenseClaimRepository : GenericRepository<ExpenseClaim>, IExpenseClaimRepository
{
    /// <inheritdoc />
    public ExpenseClaimRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<List<ExpenseClaim>> GetByEmployeeIdAsync(int employeeId, CancellationToken ct = default)
    {
        return await _dbContext.Set<ExpenseClaim>()
            .Where(x => x.EmployeeId == employeeId)
            .OrderByDescending(x => x.ExpenseDate)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<List<ExpenseClaim>> GetClaimsAsync(ExpenseStatus? status, ExpenseCategory? category, int? companyId = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<ExpenseClaim>()
            .Include(x => x.Employee)
            .AsQueryable();

        if (companyId.HasValue)
        {
            var cid = companyId.Value;
            query = query.Where(x => x.Employee != null && ((x.Employee.Department != null && x.Employee.Department.CompanyId == cid) || (x.Employee.Branch != null && x.Employee.Branch.CompanyId == cid)));
        }

        if (status.HasValue)
        {
            query = query.Where(x => x.Status == status.Value);
        }

        if (category.HasValue)
        {
            query = query.Where(x => x.Category == category.Value);
        }

        return await query.OrderByDescending(x => x.ExpenseDate).ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<List<ExpenseClaim>> GetApprovedForReimbursementAsync(int employeeId, CancellationToken ct = default)
    {
        return await _dbContext.Set<ExpenseClaim>()
            .Where(x => x.EmployeeId == employeeId && x.Status == ExpenseStatus.FinanceApproved)
            .ToListAsync(ct);
    }
}
