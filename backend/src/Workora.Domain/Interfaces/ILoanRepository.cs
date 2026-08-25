using Workora.Domain.Entities;
using Workora.Domain.Enums;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for employee loans and EMI amortization schedules.
/// </summary>
public interface ILoanRepository : IRepository<LoanRecord>
{
    /// <summary>
    /// Gets loan with all EMI schedule lines.
    /// </summary>
    Task<LoanRecord?> GetWithSchedulesAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Gets all active and historical loans for an employee.
    /// </summary>
    Task<List<LoanRecord>> GetByEmployeeIdAsync(int employeeId, CancellationToken ct = default);

    /// <summary>
    /// Gets all company loans filtered by optional status.
    /// </summary>
    Task<List<LoanRecord>> GetCompanyLoansAsync(int? companyId, LoanStatus? status, CancellationToken ct = default);

    /// <summary>
    /// Gets active loans for payroll EMI deduction for a given month and year.
    /// </summary>
    Task<List<LoanEmiSchedule>> GetPendingEmisForMonthAsync(int month, int year, CancellationToken ct = default);
}
