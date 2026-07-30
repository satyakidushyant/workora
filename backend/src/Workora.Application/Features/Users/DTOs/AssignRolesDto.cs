namespace Workora.Application.Features.Users.DTOs;

/// <summary>
/// Data Transfer Object for assigning roles to a user account.
/// </summary>
public class AssignRolesDto
{
    /// <summary>
    /// The list of role IDs to assign to the user.
    /// </summary>
    public List<int> RoleIds { get; set; } = new();
}
