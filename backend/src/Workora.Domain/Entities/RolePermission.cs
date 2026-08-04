namespace Workora.Domain.Entities;

/// <summary>
/// Represents the junction entity between Role and Permission.
/// </summary>
public class RolePermission
{
    /// <summary>
    /// Gets the role ID foreign key.
    /// </summary>
    public int RoleId { get; private set; }

    /// <summary>
    /// Gets the navigation property to the role.
    /// </summary>
    public Role Role { get; private set; } = null!;

    /// <summary>
    /// Gets the permission ID foreign key.
    /// </summary>
    public int PermissionId { get; private set; }

    /// <summary>
    /// Gets the navigation property to the permission.
    /// </summary>
    public Permission Permission { get; private set; } = null!;

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private RolePermission() { }

    /// <summary>
    /// Factory method to create a new RolePermission junction entry.
    /// </summary>
    /// <param name="roleId">The role ID.</param>
    /// <param name="permissionId">The permission ID.</param>
    /// <returns>A new <see cref="RolePermission"/> instance.</returns>
    public static RolePermission Create(int roleId, int permissionId)
    {
        return new RolePermission
        {
            RoleId = roleId,
            PermissionId = permissionId
        };
    }
}
