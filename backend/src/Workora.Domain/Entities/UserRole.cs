namespace Workora.Domain.Entities;

/// <summary>
/// Represents the junction entity between User and Role.
/// </summary>
public class UserRole
{
    /// <summary>
    /// Gets the user ID foreign key.
    /// </summary>
    public int UserId { get; private set; }

    /// <summary>
    /// Gets the navigation property to the user.
    /// </summary>
    public User User { get; private set; } = null!;

    /// <summary>
    /// Gets the role ID foreign key.
    /// </summary>
    public int RoleId { get; private set; }

    /// <summary>
    /// Gets the navigation property to the role.
    /// </summary>
    public Role Role { get; private set; } = null!;

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private UserRole() { }

    /// <summary>
    /// Factory method to create a new UserRole junction entry.
    /// </summary>
    /// <param name="userId">The user ID.</param>
    /// <param name="roleId">The role ID.</param>
    /// <returns>A new <see cref="UserRole"/> instance.</returns>
    public static UserRole Create(int userId, int roleId)
    {
        return new UserRole
        {
            UserId = userId,
            RoleId = roleId
        };
    }
}
