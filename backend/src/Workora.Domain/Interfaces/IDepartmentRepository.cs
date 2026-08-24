using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for <see cref="Department"/> entities.
/// </summary>
public interface IDepartmentRepository : IRepository<Department>
{
    /// <summary>
    /// Gets all departments for a given company.
    /// </summary>
    /// <param name="companyId">The company ID.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>A list of departments.</returns>
    Task<IReadOnlyList<Department>> GetByCompanyIdAsync(int companyId, CancellationToken ct = default);

    /// <summary>
    /// Checks if a department code is unique within a company.
    /// </summary>
    /// <param name="companyId">The company ID.</param>
    /// <param name="code">The department code.</param>
    /// <param name="excludeId">Optional department ID to exclude when updating.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>True if unique; otherwise, false.</returns>
    Task<bool> IsCodeUniqueAsync(int companyId, string code, int? excludeId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets a department by ID with child departments and designations included.
    /// </summary>
    Task<Department?> GetWithDetailsAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Gets a paginated list of departments.
    /// </summary>
    Task<IReadOnlyList<Department>> GetPagedListAsync(int pageNumber, int pageSize, string? searchTerm = null, int? companyId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets total count of departments matching filters.
    /// </summary>
    Task<int> GetCountAsync(string? searchTerm = null, int? companyId = null, CancellationToken ct = default);
}
