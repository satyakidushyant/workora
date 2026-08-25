using Workora.Domain.Entities;
using Workora.Domain.Enums;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for employee expense reimbursement claims.
/// </summary>
public interface IExpenseClaimRepository : IRepository<ExpenseClaim>
{
    /// <summary>
    /// Gets all claims submitted by a specific employee.
    /// </summary>
    Task<List<ExpenseClaim>> GetByEmployeeIdAsync(int employeeId, CancellationToken ct = default);

    /// <summary>
    /// Gets company claims filtered by status and category.
    /// </summary>
    Task<List<ExpenseClaim>> GetClaimsAsync(ExpenseStatus? status, ExpenseCategory? category, CancellationToken ct = default);

    /// <summary>
    /// Gets claims approved for reimbursement in upcoming payroll.
    /// </summary>
    Task<List<ExpenseClaim>> GetApprovedForReimbursementAsync(int employeeId, CancellationToken ct = default);
}
