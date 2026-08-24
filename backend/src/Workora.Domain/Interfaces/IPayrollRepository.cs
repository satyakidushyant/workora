using Workora.Domain.Entities;
using Workora.Domain.Enums;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for payroll runs and payslips.
/// </summary>
public interface IPayrollRepository : IRepository<PayrollRun>
{
    /// <summary>
    /// Gets a payroll run by month, year, and company.
    /// </summary>
    Task<PayrollRun?> GetByPeriodAsync(int companyId, int month, int year, CancellationToken ct = default);

    /// <summary>
    /// Gets a payroll run with all payslips and itemized breakdowns.
    /// </summary>
    Task<PayrollRun?> GetWithPayslipsAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Gets a paginated list of payroll runs.
    /// </summary>
    Task<IReadOnlyList<PayrollRun>> GetPagedRunsAsync(int pageNumber, int pageSize, int? companyId = null, PayrollStatus? status = null, CancellationToken ct = default);

    /// <summary>
    /// Gets total count of payroll runs.
    /// </summary>
    Task<int> GetRunsCountAsync(int? companyId = null, PayrollStatus? status = null, CancellationToken ct = default);

    /// <summary>
    /// Gets a specific payslip by ID with all breakdown items.
    /// </summary>
    Task<Payslip?> GetPayslipByIdAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Gets all payslips for an employee.
    /// </summary>
    Task<IReadOnlyList<Payslip>> GetEmployeePayslipsAsync(int employeeId, int? year = null, CancellationToken ct = default);
}
