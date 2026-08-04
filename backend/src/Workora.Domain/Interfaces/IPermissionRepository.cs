using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Domain repository interface for managing <see cref="Permission"/> reference entities.
/// </summary>
public interface IPermissionRepository : IRepository<Permission>
{
    /// <summary>
    /// Gets all active permissions in the system.
    /// </summary>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>A read-only list of permissions.</returns>
    Task<IReadOnlyList<Permission>> GetAllAsync(CancellationToken ct = default);

    /// <summary>
    /// Gets permissions by a list of permission IDs.
    /// </summary>
    /// <param name="ids">The collection of permission IDs.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>A list of matching permission entities.</returns>
    Task<IReadOnlyList<Permission>> GetByIdsAsync(IEnumerable<int> ids, CancellationToken ct = default);
}
