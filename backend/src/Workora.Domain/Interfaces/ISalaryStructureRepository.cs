using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for <see cref="SalaryStructure"/> and employee salary assignments.
/// </summary>
public interface ISalaryStructureRepository : IRepository<SalaryStructure>
{
    /// <summary>
    /// Gets salary structures for a company with component breakdowns.
    /// </summary>
    Task<IReadOnlyList<SalaryStructure>> GetByCompanyIdAsync(int companyId, CancellationToken ct = default);

    /// <summary>
    /// Gets a salary structure by ID with loaded components.
    /// </summary>
    Task<SalaryStructure?> GetWithComponentsAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Gets the current active salary assignment for an employee.
    /// </summary>
    Task<EmployeeSalaryAssignment?> GetActiveEmployeeAssignmentAsync(int employeeId, DateOnly? date = null, CancellationToken ct = default);

    /// <summary>
    /// Assigns a salary structure to an employee.
    /// </summary>
    Task AssignStructureAsync(EmployeeSalaryAssignment assignment, CancellationToken ct = default);
}
