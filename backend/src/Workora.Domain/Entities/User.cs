using Workora.Domain.Common;
using Workora.Domain.ValueObjects;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a user account in the system.
/// </summary>
public class User : AuditableEntity
{
    /// <summary>
    /// The user's email address, used for login.
    /// </summary>
    public EmailAddress Email { get; private set; } = null!;

    /// <summary>
    /// The user's first name.
    /// </summary>
    public string FirstName { get; private set; } = null!;

    /// <summary>
    /// The user's last name.
    /// </summary>
    public string LastName { get; private set; } = null!;

    /// <summary>
    /// The hashed password.
    /// </summary>
    public string PasswordHash { get; private set; } = null!;

    /// <summary>
    /// Optional foreign key to an employee record.
    /// </summary>
    public int? EmployeeId { get; private set; }

    /// <summary>
    /// Count of consecutive failed login attempts.
    /// </summary>
    public int FailedLoginAttempts { get; private set; }

    /// <summary>
    /// The date and time when the account will be unlocked.
    /// </summary>
    public DateTimeOffset? LockoutEnd { get; private set; }

    // Navigation properties can be added here (e.g., RefreshTokens, UserRoles)
    
    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private User() { } // Required for EF Core

    /// <summary>
    /// Creates a new User instance.
    /// </summary>
    /// <param name="email">The user's email.</param>
    /// <param name="firstName">The user's first name.</param>
    /// <param name="lastName">The user's last name.</param>
    /// <param name="passwordHash">The hashed password.</param>
    /// <param name="employeeId">The optional employee ID.</param>
    /// <returns>A new User entity.</returns>
    public static User Create(EmailAddress email, string firstName, string lastName, string passwordHash, int? employeeId = null)
    {
        return new User
        {
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            PasswordHash = passwordHash,
            EmployeeId = employeeId,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates the user's password hash.
    /// </summary>
    /// <param name="newPasswordHash">The new hashed password.</param>
    public void UpdatePassword(string newPasswordHash)
    {
        PasswordHash = newPasswordHash;
    }

    /// <summary>
    /// Increments the failed login attempts and locks out the account if threshold is reached.
    /// </summary>
    public void RecordFailedLogin()
    {
        FailedLoginAttempts++;
        if (FailedLoginAttempts >= 5)
        {
            LockoutEnd = DateTimeOffset.UtcNow.AddMinutes(15);
        }
    }

    /// <summary>
    /// Resets the failed login attempts and removes lockout.
    /// </summary>
    public void ResetFailedLogin()
    {
        FailedLoginAttempts = 0;
        LockoutEnd = null;
    }

    /// <summary>
    /// Checks if the user is currently locked out.
    /// </summary>
    public bool IsLockedOut => LockoutEnd.HasValue && LockoutEnd.Value > DateTimeOffset.UtcNow;
}
