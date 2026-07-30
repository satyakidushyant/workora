namespace Workora.Application.Features.Users.DTOs;

/// <summary>
/// Data Transfer Object for updating a user's profile details.
/// </summary>
public class UpdateUserRequestDto
{
    /// <summary>
    /// The updated first name.
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// The updated last name.
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// Optional updated employee ID.
    /// </summary>
    public int? EmployeeId { get; set; }
}
