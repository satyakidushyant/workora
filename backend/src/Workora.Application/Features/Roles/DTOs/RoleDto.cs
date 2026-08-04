namespace Workora.Application.Features.Roles.DTOs;

/// <summary>
/// Data Transfer Object representing a role summary.
/// </summary>
public class RoleDto
{
    /// <summary>
    /// Gets or sets the unique role ID.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the role name.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the role description.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Gets or sets a value indicating whether this is a system role.
    /// </summary>
    public bool IsSystemRole { get; set; }

    /// <summary>
    /// Gets or sets the count of users assigned to this role.
    /// </summary>
    public int UserCount { get; set; }

    /// <summary>
    /// Gets or sets the count of permissions assigned to this role.
    /// </summary>
    public int PermissionCount { get; set; }

    /// <summary>
    /// Gets or sets the creation date.
    /// </summary>
    public DateTimeOffset CreatedAt { get; set; }
}
