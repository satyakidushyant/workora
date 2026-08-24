using Microsoft.EntityFrameworkCore;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Persistence.Repositories;

/// <summary>
/// Repository implementation for <see cref="LeaveBalance"/> entities.
/// </summary>
public class LeaveBalanceRepository : GenericRepository<LeaveBalance>, ILeaveBalanceRepository
{
    /// <summary>
    /// Initializes a new instance of the <see cref="LeaveBalanceRepository"/> class.
    /// </summary>
    /// <param name="dbContext">The database context.</param>
    public LeaveBalanceRepository(AppDbContext dbContext) : base(dbContext) { }

    /// <inheritdoc />
    public async Task<IReadOnlyList<LeaveBalance>> GetBalancesAsync(int employeeId, int year, CancellationToken ct = default)
    {
        return await _dbContext.Set<LeaveBalance>()
            .Include(b => b.LeaveType)
            .Where(b => b.EmployeeId == employeeId && b.Year == year)
            .OrderBy(b => b.LeaveType.Name)
            .ToListAsync(ct);
    }

    /// <inheritdoc />
    public async Task<LeaveBalance?> GetBalanceAsync(int employeeId, int leaveTypeId, int year, CancellationToken ct = default)
    {
        return await _dbContext.Set<LeaveBalance>()
            .Include(b => b.LeaveType)
            .FirstOrDefaultAsync(b => b.EmployeeId == employeeId && b.LeaveTypeId == leaveTypeId && b.Year == year, ct);
    }
}
