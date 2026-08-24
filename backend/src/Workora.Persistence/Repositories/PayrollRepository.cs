using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for payroll runs and employee payslips.
/// </summary>
public class PayrollRepository : GenericRepository<PayrollRun>, IPayrollRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="PayrollRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public PayrollRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<PayrollRun?> GetByPeriodAsync(int companyId, int month, int year, CancellationToken ct = default)
    {
        return await _dbContext.Set<PayrollRun>()
            .Include(r => r.Payslips)
            .ThenInclude(p => p.Items)
            .FirstOrDefaultAsync(r => r.CompanyId == companyId && r.PeriodMonth == month && r.PeriodYear == year, ct);
    }

    /// <inheritdoc />
    public async Task<PayrollRun?> GetWithPayslipsAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<PayrollRun>()
            .Include(r => r.Payslips)
            .ThenInclude(p => p.Items)
            .FirstOrDefaultAsync(r => r.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<PayrollRun>> GetPagedRunsAsync(int pageNumber, int pageSize, int? companyId = null, PayrollStatus? status = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<PayrollRun>().AsNoTracking().AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(r => r.CompanyId == companyId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(r => r.Status == status.Value);
        }

        return await query
            .OrderByDescending(r => r.PeriodYear)
            .ThenByDescending(r => r.PeriodMonth)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<int> GetRunsCountAsync(int? companyId = null, PayrollStatus? status = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<PayrollRun>().AsNoTracking().AsQueryable();

        if (companyId.HasValue)
        {
            query = query.Where(r => r.CompanyId == companyId.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(r => r.Status == status.Value);
        }

        return await query.CountAsync(ct);
    }

    /// <inheritdoc />
    public async Task<Payslip?> GetPayslipByIdAsync(int id, CancellationToken ct = default)
    {
        return await _dbContext.Set<Payslip>()
            .Include(p => p.Items)
            .Include(p => p.Employee)
            .Include(p => p.PayrollRun)
            .FirstOrDefaultAsync(p => p.Id == id, ct);
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<Payslip>> GetEmployeePayslipsAsync(int employeeId, int? year = null, CancellationToken ct = default)
    {
        var query = _dbContext.Set<Payslip>()
            .AsNoTracking()
            .Include(p => p.Items)
            .Include(p => p.PayrollRun)
            .Where(p => p.EmployeeId == employeeId);

        if (year.HasValue)
        {
            query = query.Where(p => p.PayrollRun.PeriodYear == year.Value);
        }

        return await query
            .OrderByDescending(p => p.PayrollRun.PeriodYear)
            .ThenByDescending(p => p.PayrollRun.PeriodMonth)
            .ToListAsync(ct);
    }
}
