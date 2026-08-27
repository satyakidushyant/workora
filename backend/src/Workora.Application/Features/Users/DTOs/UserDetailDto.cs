namespace Workora.Application.Features.Users.DTOs;

/// <summary>
/// Data Transfer Object representing detailed user account information, including roles and lockout state.
/// </summary>
public class UserDetailDto : UserDto
{
    /// <summary>
    /// The count of consecutive failed login attempts.
    /// </summary>
    public int FailedLoginAttempts { get; set; }

    /// <summary>
    /// The datetime when account lockout ends, if locked out.
    /// </summary>
    public DateTimeOffset? LockoutEnd { get; set; }

    /// <summary>
    /// Indicates whether the user account is currently locked out.
    /// </summary>
    public bool IsLockedOut { get; set; }
}
