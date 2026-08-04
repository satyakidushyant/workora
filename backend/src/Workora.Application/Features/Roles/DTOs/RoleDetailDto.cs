using Workora.Application.Features.Permissions.DTOs;

namespace Workora.Application.Features.Roles.DTOs;

/// <summary>
/// Data Transfer Object representing detailed role information including assigned permissions.
/// </summary>
public class RoleDetailDto : RoleDto
{
    /// <summary>
    /// Gets or sets the list of assigned permissions.
    /// </summary>
    public List<PermissionDto> Permissions { get; set; } = new();
}
