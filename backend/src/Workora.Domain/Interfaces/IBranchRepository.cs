using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for <see cref="Branch"/> entities.
/// </summary>
public interface IBranchRepository : IRepository<Branch>
{
    /// <summary>
    /// Gets all branches for a given company.
    /// </summary>
    /// <param name="companyId">The company ID.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>A list of branches.</returns>
    Task<IReadOnlyList<Branch>> GetByCompanyIdAsync(int companyId, CancellationToken ct = default);

    /// <summary>
    /// Checks if a branch code is unique within a company.
    /// </summary>
    /// <param name="companyId">The company ID.</param>
    /// <param name="code">The branch code.</param>
    /// <param name="excludeId">Optional branch ID to exclude when updating.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>True if unique; otherwise, false.</returns>
    Task<bool> IsCodeUniqueAsync(int companyId, string code, int? excludeId = null, CancellationToken ct = default);

    /// <summary>
    /// Gets a paginated list of branches with optional search term and status.
    /// </summary>
    Task<IReadOnlyList<Branch>> GetPagedListAsync(int pageNumber, int pageSize, string? searchTerm = null, bool? isActive = null, CancellationToken ct = default);

    /// <summary>
    /// Gets total count of branches matching filters.
    /// </summary>
    Task<int> GetCountAsync(string? searchTerm = null, bool? isActive = null, CancellationToken ct = default);
}
