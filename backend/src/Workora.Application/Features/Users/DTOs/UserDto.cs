namespace Workora.Application.Features.Users.DTOs;

/// <summary>
/// Data Transfer Object representing a user account summary.
/// </summary>
public class UserDto
{
    /// <summary>
    /// The unique identifier of the user.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The global unique identifier.
    /// </summary>
    public string Uuid { get; set; } = string.Empty;

    /// <summary>
    /// The user's email address.
    /// </summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// The user's first name.
    /// </summary>
    public string FirstName { get; set; } = string.Empty;

    /// <summary>
    /// The user's last name.
    /// </summary>
    public string LastName { get; set; } = string.Empty;

    /// <summary>
    /// The user's full name.
    /// </summary>
    public string FullName => $"{FirstName} {LastName}".Trim();

    /// <summary>
    /// The linked employee ID, if any.
    /// </summary>
    public int? EmployeeId { get; set; }

    /// <summary>
    /// The unique identifier of the user's company/tenant.
    /// </summary>
    public int? CompanyId { get; set; }

    /// <summary>
    /// The name of the user's company/tenant.
    /// </summary>
    public string? CompanyName { get; set; }

    /// <summary>
    /// The code of the user's company/tenant.
    /// </summary>
    public string? CompanyCode { get; set; }

    /// <summary>
    /// The employee code of the linked employee, if any.
    /// </summary>
    public string? EmployeeCode { get; set; }

    /// <summary>
    /// The department name of the linked employee, if any.
    /// </summary>
    public string? DepartmentName { get; set; }

    /// <summary>
    /// Indicates whether the user account is active.
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// The date and time when the account was created.
    /// </summary>
    public DateTimeOffset CreatedAt { get; set; }

    /// <summary>
    /// The list of assigned role names.
    /// </summary>
    public List<string> Roles { get; set; } = new();
}

