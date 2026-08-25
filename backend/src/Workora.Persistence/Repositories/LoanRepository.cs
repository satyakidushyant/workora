using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="LoanRecord"/>.
/// </summary>
public class LoanRepository : GenericRepository<LoanRecord>, ILoanRepository
{
    /// <inheritdoc />
    public LoanRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<LoanRecord?> GetWithSchedulesAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<LoanRecord>()
            .Include(x => x.Employee)
            .Include(x => x.EmiSchedules.OrderBy(s => s.InstallmentNumber))
            .FirstOrDefaultAsync(x => x.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<List<LoanRecord>> GetByEmployeeIdAsync(int employeeId, CancellationToken ct = default)
    {
        return await _dbContext.Set<LoanRecord>()
            .Include(x => x.EmiSchedules)
            .Where(x => x.EmployeeId == employeeId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<List<LoanRecord>> GetCompanyLoansAsync(int? companyId, LoanStatus? status, CancellationToken ct = default)
    {
        var query = _dbContext.Set<LoanRecord>()
            .Include(x => x.Employee)
                .ThenInclude(e => e.Branch)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(x => x.Status == status.Value);
        }

        if (companyId.HasValue)
        {
            query = query.Where(x => x.Employee.Branch.CompanyId == companyId.Value);
        }

        return await query.OrderByDescending(x => x.CreatedAt).ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<List<LoanEmiSchedule>> GetPendingEmisForMonthAsync(int month, int year, CancellationToken ct = default)
    {
        return await _dbContext.Set<LoanEmiSchedule>()
            .Include(x => x.LoanRecord)
                .ThenInclude(l => l.Employee)
            .Where(x => !x.IsPaid &&
                        x.LoanRecord.Status == LoanStatus.Active &&
                        x.DueDate.Month == month &&
                        x.DueDate.Year == year)
            .ToListAsync(ct);
    }
}
