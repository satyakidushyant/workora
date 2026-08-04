namespace Workora.Persistence.Seeders;

/// <summary>
/// Contains compile-time catalog definition of all system permissions.
/// </summary>
public static class PermissionCatalog
{
    /// <summary>
    /// Definition record for seeding permissions.
    /// </summary>
    /// <param name="Code">The permission unique code.</param>
    /// <param name="Name">The display name.</param>
    /// <param name="Module">The parent module name.</param>
    /// <param name="Description">The optional description.</param>
    public record PermissionDefinition(string Code, string Name, string Module, string Description);

    /// <summary>
    /// Gets all pre-configured system permissions.
    /// </summary>
    public static readonly IReadOnlyList<PermissionDefinition> SystemPermissions = new List<PermissionDefinition>
    {
        // Authentication Module (9.1)
        new("auth.logout", "Logout", "Authentication", "Allows user logout"),
        new("auth.change-password", "Change Password", "Authentication", "Allows self-service password change"),
        new("auth.me", "View Profile", "Authentication", "Allows viewing own authenticated account profile"),
        new("auth.sessions", "List Sessions", "Authentication", "Allows listing active login sessions"),
        new("auth.logout-all", "Logout All Sessions", "Authentication", "Allows revoking all active login sessions"),

        // Users Module (9.2)
        new("users.view", "View Users", "Users", "Allows viewing system user accounts"),
        new("users.create", "Create User", "Users", "Allows creating new user accounts"),
        new("users.update", "Update User", "Users", "Allows updating user account details"),
        new("users.deactivate", "Deactivate/Activate User", "Users", "Allows deactivating or reactivating user accounts"),
        new("users.assign-roles", "Assign User Roles", "Users", "Allows assigning roles to user accounts"),
        new("users.delete", "Delete User", "Users", "Allows hard deleting user accounts"),
        new("users.manage", "Manage Users / Admin Reset Password", "Users", "Allows administrative actions such as resetting user passwords"),

        // Roles Module (9.3)
        new("roles.view", "View Roles", "Roles", "Allows viewing roles and role permissions"),
        new("roles.create", "Create Role", "Roles", "Allows creating new system or custom roles"),
        new("roles.update", "Update Role", "Roles", "Allows updating role name and description"),
        new("roles.delete", "Delete Role", "Roles", "Allows deleting non-system custom roles"),
        new("roles.manage-permissions", "Manage Role Permissions", "Roles", "Allows modifying permission assignments of roles"),

        // Permissions Module (9.4)
        new("permissions.view", "View Permissions Catalog", "Permissions", "Allows viewing the full catalog of available system permissions")
    };
}
