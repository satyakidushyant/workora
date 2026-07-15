using System.Collections.Generic;

namespace Workora.Application.Features.Authentication.DTOs;

/// <summary>
/// Data transfer object for the current user's profile details.
/// </summary>
/// <param name="Id">The globally unique identifier of the user.</param>
/// <param name="Email">The user's email address.</param>
/// <param name="FirstName">The user's first name.</param>
/// <param name="LastName">The user's last name.</param>
/// <param name="EmployeeId">The internal employee ID linked to this user, if any.</param>
/// <param name="Roles">The roles assigned to the user.</param>
/// <param name="Permissions">The permissions granted to the user.</param>
public record UserProfileDto(
    Guid Id,
    string Email,
    string FirstName,
    string LastName,
    int? EmployeeId,
    IReadOnlyList<string> Roles,
    IReadOnlyList<string> Permissions
);
