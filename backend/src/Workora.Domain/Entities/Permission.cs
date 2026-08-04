using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a discrete, seedable permission mapping to protected API operations.
/// </summary>
public class Permission : BaseEntity
{
    private readonly List<RolePermission> _rolePermissions = new();

    /// <summary>
    /// Gets the unique permission code identifier (e.g., "users.view", "roles.create").
    /// </summary>
    public string Code { get; private set; } = null!;

    /// <summary>
    /// Gets the friendly permission name.
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// Gets the module grouping for this permission (e.g., "Users", "Roles").
    /// </summary>
    public string Module { get; private set; } = null!;

    /// <summary>
    /// Gets the optional permission description.
    /// </summary>
    public string? Description { get; private set; }

    /// <summary>
    /// Gets the navigation collection of role permission assignments.
    /// </summary>
    public IReadOnlyCollection<RolePermission> RolePermissions => _rolePermissions.AsReadOnly();

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Permission() { }

    /// <summary>
    /// Factory method to create a new Permission.
    /// </summary>
    /// <param name="code">The unique permission code string.</param>
    /// <param name="name">The permission friendly name.</param>
    /// <param name="module">The functional module grouping.</param>
    /// <param name="description">The optional description.</param>
    /// <returns>A new <see cref="Permission"/> instance.</returns>
    public static Permission Create(string code, string name, string module, string? description = null)
    {
        return new Permission
        {
            Code = code.Trim().ToLowerInvariant(),
            Name = name.Trim(),
            Module = module.Trim(),
            Description = description?.Trim()
        };
    }
}
