namespace Workora.Application.Features.Roles.DTOs;

/// <summary>
/// Data Transfer Object for creating a new role.
/// </summary>
public class CreateRoleRequestDto
{
    /// <summary>
    /// Gets or sets the role name.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the role description.
    /// </summary>
    public string? Description { get; set; }

    /// <summary>
    /// Gets or sets the initial list of permission IDs to assign.
    /// </summary>
    public List<int> PermissionIds { get; set; } = new();
}
