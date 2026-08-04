namespace Workora.Application.Features.Roles.DTOs;

/// <summary>
/// Data Transfer Object for setting permissions assigned to a role.
/// </summary>
public class SetRolePermissionsDto
{
    /// <summary>
    /// Gets or sets the complete list of permission IDs to be assigned to the role.
    /// </summary>
    public List<int> PermissionIds { get; set; } = new();
}
