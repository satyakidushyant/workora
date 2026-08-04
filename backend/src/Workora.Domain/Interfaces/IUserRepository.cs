using Workora.Domain.Entities;
using Workora.Domain.ValueObjects;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for User entities.
/// </summary>
public interface IUserRepository : IRepository<User>
{
    /// <summary>
    /// Gets a user by their email address.
    /// </summary>
    /// <param name="email">The email address.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>The user if found; otherwise, null.</returns>
    Task<User?> GetByEmailAsync(EmailAddress email, CancellationToken ct = default);

    /// <summary>
    /// Checks if an email is unique across all users.
    /// </summary>
    /// <param name="email">The email to check.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>True if the email is unique; otherwise, false.</returns>
    Task<bool> IsEmailUniqueAsync(EmailAddress email, CancellationToken ct = default);

    /// <summary>
    /// Gets a paginated list of users with optional filtering.
    /// </summary>
    /// <param name="pageNumber">The 1-based page number.</param>
    /// <param name="pageSize">The number of items per page.</param>
    /// <param name="searchTerm">Optional search term for filtering by name or email.</param>
    /// <param name="isActive">Optional active status filter.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>A list of users matching the criteria.</returns>
    Task<IReadOnlyList<User>> GetPagedListAsync(int pageNumber, int pageSize, string? searchTerm = null, bool? isActive = null, CancellationToken ct = default);

    /// <summary>
    /// Gets the total count of users matching optional filters.
    /// </summary>
    /// <param name="searchTerm">Optional search term for filtering by name or email.</param>
    /// <param name="isActive">Optional active status filter.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>The total matching user count.</returns>
    Task<int> GetCountAsync(string? searchTerm = null, bool? isActive = null, CancellationToken ct = default);

    /// <summary>
    /// Checks if there is another SuperAdmin user besides the specified user ID.
    /// </summary>
    /// <param name="excludeUserId">The user ID to exclude.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>True if another SuperAdmin exists; otherwise, false.</returns>
    Task<bool> HasOtherSuperAdminAsync(int excludeUserId, CancellationToken ct = default);

    /// <summary>
    /// Updates the assigned roles for a target user.
    /// </summary>
    /// <param name="userId">The user ID.</param>
    /// <param name="roleIds">The collection of role IDs.</param>
    /// <param name="ct">The cancellation token.</param>
    Task AssignUserRolesAsync(int userId, IEnumerable<int> roleIds, CancellationToken ct = default);
}


