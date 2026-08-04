using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using Workora.API.Policies;

namespace Workora.API.Extensions;

/// <summary>
/// Extension methods for configuring application authorization policies and providers.
/// </summary>
public static class AuthorizationPolicyExtensions
{
    /// <summary>
    /// Registers authorization policies, permission handlers, and dynamic policy providers.
    /// </summary>
    /// <param name="services">The service collection instance.</param>
    /// <returns>The updated <see cref="IServiceCollection"/>.</returns>
    public static IServiceCollection AddWorkoraAuthorization(this IServiceCollection services)
    {
        // Register dynamic permission policy provider and handler
        services.AddSingleton<IAuthorizationPolicyProvider, PermissionPolicyProvider>();
        services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();

        services.AddAuthorization(options =>
        {
            // Module 1: Authentication Policies
            options.AddPolicy("auth.logout", policy => policy.RequireAuthenticatedUser());
            options.AddPolicy("auth.change-password", policy => policy.RequireAuthenticatedUser());
            options.AddPolicy("auth.me", policy => policy.RequireAuthenticatedUser());
            options.AddPolicy("auth.sessions", policy => policy.RequireAuthenticatedUser());
            options.AddPolicy("auth.logout-all", policy => policy.RequireAuthenticatedUser());

            // Module 2: Users Module Policies
            options.AddPolicy("users.view", policy => policy.RequireAuthenticatedUser());
            options.AddPolicy("users.create", policy => policy.RequireAuthenticatedUser());
            options.AddPolicy("users.update", policy => policy.RequireAuthenticatedUser());
            options.AddPolicy("users.deactivate", policy => policy.RequireAuthenticatedUser());
            options.AddPolicy("users.activate", policy => policy.RequireAuthenticatedUser());
            options.AddPolicy("users.assign-roles", policy => policy.RequireAuthenticatedUser());
            options.AddPolicy("users.delete", policy => policy.RequireAuthenticatedUser());
            options.AddPolicy("users.reset-password", policy => policy.RequireAuthenticatedUser());

            // Module 3: Roles Module Policies
            options.AddPolicy("roles.view", policy => policy.RequireAuthenticatedUser());
            options.AddPolicy("roles.create", policy => policy.RequireAuthenticatedUser());
            options.AddPolicy("roles.update", policy => policy.RequireAuthenticatedUser());
            options.AddPolicy("roles.delete", policy => policy.RequireAuthenticatedUser());
            options.AddPolicy("roles.manage-permissions", policy => policy.RequireAuthenticatedUser());

            // Module 4: Permissions Module Policies
            options.AddPolicy("permissions.view", policy => policy.RequireAuthenticatedUser());
        });


        return services;
    }
}
