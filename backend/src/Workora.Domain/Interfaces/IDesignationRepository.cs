using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for <see cref="Designation"/> entities.
/// </summary>
public interface IDesignationRepository : IRepository<Designation>
{
    /// <summary>
    /// Gets all designations for a specific department.
    /// </summary>
    /// <param name="departmentId">The department ID.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>A list of designations.</returns>
    Task<IReadOnlyList<Designation>> GetByDepartmentIdAsync(int departmentId, CancellationToken ct = default);

    /// <summary>
    /// Checks if a designation title is unique within a department.
    /// </summary>
    /// <param name="departmentId">The department ID.</param>
    /// <param name="title">The designation title.</param>
    /// <param name="excludeId">Optional designation ID to exclude when updating.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>True if unique; otherwise, false.</returns>
    Task<bool> IsTitleUniqueAsync(int departmentId, string title, int? excludeId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets a paginated list of designations with optional department and search filters.
    /// </summary>
    Task<IReadOnlyList<Designation>> GetPagedListAsync(int pageNumber, int pageSize, string? searchTerm = null, int? departmentId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets total count of designations matching filters.
    /// </summary>
    Task<int> GetCountAsync(string? searchTerm = null, int? departmentId = null, CancellationToken ct = default);
}
