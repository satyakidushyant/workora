namespace Workora.Application.Features.Roles.DTOs;

/// <summary>
/// Data Transfer Object for cloning an existing role.
/// </summary>
public class CloneRoleRequestDto
{
    /// <summary>
    /// Gets or sets the name for the new cloned role.
    /// </summary>
    public string NewName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the optional description for the cloned role.
    /// </summary>
    public string? Description { get; set; }
}
