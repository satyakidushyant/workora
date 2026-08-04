namespace Workora.Application.Features.Roles.DTOs;

/// <summary>
/// Data Transfer Object for updating an existing role.
/// </summary>
public class UpdateRoleRequestDto
{
    /// <summary>
    /// Gets or sets the updated role name.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the updated role description.
    /// </summary>
    public string? Description { get; set; }
}
