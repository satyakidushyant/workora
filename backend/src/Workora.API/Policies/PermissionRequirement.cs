using Microsoft.AspNetCore.Authorization;

namespace Workora.API.Policies;

/// <summary>
/// Represents a permission requirement for authorization policies.
/// </summary>
public class PermissionRequirement : IAuthorizationRequirement
{
    /// <summary>
    /// Gets the permission string required by this requirement.
    /// </summary>
    public string Permission { get; }

    /// <summary>
    /// Initializes a new instance of the <see cref="PermissionRequirement"/> class.
    /// </summary>
    /// <param name="permission">The required permission.</param>
    public PermissionRequirement(string permission)
    {
        Permission = permission;
    }
}
