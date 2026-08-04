using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a system or custom user role grouping multiple permissions.
/// </summary>
public class Role : AuditableEntity
{
    private readonly List<UserRole> _userRoles = new();
    private readonly List<RolePermission> _rolePermissions = new();

    /// <summary>
    /// Gets the role name.
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// Gets the optional role description.
    /// </summary>
    public string? Description { get; private set; }

    /// <summary>
    /// Gets a value indicating whether this is a system-defined role that cannot be deleted.
    /// </summary>
    public bool IsSystemRole { get; private set; }

    /// <summary>
    /// Gets the navigation collection of user role assignments.
    /// </summary>
    public IReadOnlyCollection<UserRole> UserRoles => _userRoles.AsReadOnly();

    /// <summary>
    /// Gets the navigation collection of role permission assignments.
    /// </summary>
    public IReadOnlyCollection<RolePermission> RolePermissions => _rolePermissions.AsReadOnly();

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Role() { }

    /// <summary>
    /// Factory method to create a new Role.
    /// </summary>
    /// <param name="name">The role name.</param>
    /// <param name="description">The optional description.</param>
    /// <param name="isSystemRole">Indicates if the role is a system role.</param>
    /// <returns>A new <see cref="Role"/> instance.</returns>
    public static Role Create(string name, string? description = null, bool isSystemRole = false)
    {
        return new Role
        {
            Name = name.Trim(),
            Description = description?.Trim(),
            IsSystemRole = isSystemRole,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates the role details.
    /// </summary>
    /// <param name="name">The updated role name.</param>
    /// <param name="description">The updated description.</param>
    public void Update(string name, string? description)
    {
        Name = name.Trim();
        Description = description?.Trim();
    }
}
