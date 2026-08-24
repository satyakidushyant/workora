using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for <see cref="Shift"/> and shift assignment operations.
/// </summary>
public interface IShiftRepository : IRepository<Shift>
{
    /// <summary>
    /// Gets all shifts for a company.
    /// </summary>
    Task<IReadOnlyList<Shift>> GetByCompanyIdAsync(int companyId, CancellationToken ct = default);

    /// <summary>
    /// Checks if a shift code is unique within a company.
    /// </summary>
    Task<bool> IsCodeUniqueAsync(int companyId, string code, int? excludeId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets a paginated list of shifts.
    /// </summary>
    Task<IReadOnlyList<Shift>> GetPagedListAsync(int pageNumber, int pageSize, string? searchTerm = null, int? companyId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets total count of shifts matching filters.
    /// </summary>
    Task<int> GetCountAsync(string? searchTerm = null, int? companyId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets the currently active shift assignment for an employee on a given date.
    /// </summary>
    Task<EmployeeShiftAssignment?> GetActiveAssignmentAsync(int employeeId, DateOnly date, CancellationToken ct = default);

    /// <summary>
    /// Assigns a shift to an employee.
    /// </summary>
    Task AssignShiftAsync(EmployeeShiftAssignment assignment, CancellationToken ct = default);
}
