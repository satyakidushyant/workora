using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for managing employee leave balances.
/// </summary>
public interface ILeaveBalanceRepository : IRepository<LeaveBalance>
{
    /// <summary>
    /// Gets all leave balances for an employee in a specific year.
    /// </summary>
    Task<IReadOnlyList<LeaveBalance>> GetBalancesAsync(int employeeId, int year, CancellationToken ct = default);

    /// <summary>
    /// Gets a specific leave balance for an employee and leave type.
    /// </summary>
    Task<LeaveBalance?> GetBalanceAsync(int employeeId, int leaveTypeId, int year, CancellationToken ct = default);
}
