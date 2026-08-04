namespace Workora.Application.Features.Permissions.DTOs;

/// <summary>
/// Data Transfer Object representing a permission item.
/// </summary>
public class PermissionDto
{
    /// <summary>
    /// Gets or sets the unique permission ID.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the permission code string.
    /// </summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the permission friendly name.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the module name.
    /// </summary>
    public string Module { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the optional description.
    /// </summary>
    public string? Description { get; set; }
}
