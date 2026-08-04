namespace Workora.Application.Features.Permissions.DTOs;

/// <summary>
/// Data Transfer Object grouping permissions by their parent module.
/// </summary>
public class ModulePermissionsDto
{
    /// <summary>
    /// Gets or sets the module name.
    /// </summary>
    public string Module { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the list of permissions under this module.
    /// </summary>
    public List<PermissionDto> Permissions { get; set; } = new();
}
