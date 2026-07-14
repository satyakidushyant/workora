namespace Workora.Application.Common.Interfaces;

/// <summary>
/// Defines the contract for accessing information about the current authenticated user.
/// </summary>
public interface ICurrentUserService
{
    /// <summary>
    /// Gets the unique identifier of the current user.
    /// </summary>
    Guid? UserId { get; }

    /// <summary>
    /// Determines whether the current user is authenticated.
    /// </summary>
    bool IsAuthenticated { get; }

    /// <summary>
    /// Determines whether the current user belongs to the specified role.
    /// </summary>
    /// <param name="roleName">The name of the role.</param>
    /// <returns><c>true</c> if the user belongs to the role; otherwise, <c>false</c>.</returns>
    bool IsInRole(string roleName);

    /// <summary>
    /// Determines whether the current user has the specified permission.
    /// </summary>
    /// <param name="permission">The required permission.</param>
    /// <returns><c>true</c> if the user has the permission; otherwise, <c>false</c>.</returns>
    bool HasPermission(string permission);
}
