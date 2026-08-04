using Workora.Domain.Entities;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Domain repository interface for managing <see cref="Role"/> entities.
/// </summary>
public interface IRoleRepository : IRepository<Role>
{
    /// <summary>
    /// Gets a role by its unique name.
    /// </summary>
    /// <param name="name">The role name.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>The matching role entity, or null if not found.</returns>
    Task<Role?> GetByNameAsync(string name, CancellationToken ct = default);

    /// <summary>
    /// Gets a role by ID including assigned permissions.
    /// </summary>
    /// <param name="id">The role ID.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>The matching role entity with permissions included, or null if not found.</returns>
    Task<Role?> GetByIdWithPermissionsAsync(int id, CancellationToken ct = default);

    /// <summary>
    /// Checks if a role name is unique.
    /// </summary>
    /// <param name="name">The role name.</param>
    /// <param name="excludeRoleId">Optional role ID to exclude from uniqueness check.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>True if unique; otherwise false.</returns>
    Task<bool> IsNameUniqueAsync(string name, int? excludeRoleId = null, CancellationToken ct = default);

    /// <summary>
    /// Checks if a role is assigned to any active user accounts.
    /// </summary>
    /// <param name="roleId">The role ID.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>True if the role is currently in use; otherwise false.</returns>
    Task<bool> IsInUseAsync(int roleId, CancellationToken ct = default);

    /// <summary>
    /// Gets a paginated list of roles with associated user and permission counts.
    /// </summary>
    /// <param name="pageNumber">The 1-based page number.</param>
    /// <param name="pageSize">The page size.</param>
    /// <param name="searchTerm">Optional search term for filtering by role name.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>A list of roles.</returns>
    Task<IReadOnlyList<Role>> GetPagedListAsync(int pageNumber, int pageSize, string? searchTerm = null, CancellationToken ct = default);

    /// <summary>
    /// Gets the total count of roles matching the filter.
    /// </summary>
    /// <param name="searchTerm">Optional search term.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>The count of matching roles.</returns>
    Task<int> GetCountAsync(string? searchTerm = null, CancellationToken ct = default);

    /// <summary>
    /// Updates the assigned permissions for a given role.
    /// </summary>
    /// <param name="roleId">The role ID.</param>
    /// <param name="permissionIds">The collection of permission IDs.</param>
    /// <param name="ct">The cancellation token.</param>
    Task SetRolePermissionsAsync(int roleId, IEnumerable<int> permissionIds, CancellationToken ct = default);
}

