namespace Workora.Application.Features.Users.DTOs;

/// <summary>
/// Data Transfer Object for an administrator resetting a user's password.
/// </summary>
public class AdminResetPasswordRequestDto
{
    /// <summary>
    /// The new plain-text password to assign.
    /// </summary>
    public string NewPassword { get; set; } = string.Empty;
}
