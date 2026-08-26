using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Workora.API.Policies;

/// <summary>
/// Evaluates whether the current user satisfies a given <see cref="PermissionRequirement"/>.
/// Supports SuperAdmin master role bypass and discrete PBAC permission claim checks.
/// </summary>
public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    /// <summary>
    /// Evaluates the authorization requirement asynchronously against current user claims and roles.
    /// </summary>
    /// <param name="context">The authorization handler context.</param>
    /// <param name="requirement">The permission requirement to evaluate.</param>
    /// <returns>A completed task representing the asynchronous evaluation.</returns>
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        // 1. SuperAdmin Role Bypass (Tier 1 Global Platform Authority)
        if (context.User.IsInRole("SuperAdmin") ||
            context.User.HasClaim(c => c.Type == ClaimTypes.Role && c.Value == "SuperAdmin") ||
            context.User.HasClaim(c => c.Type == "role" && c.Value == "SuperAdmin") ||
            context.User.HasClaim(c => c.Type == "permission" && c.Value == "superadmin.access"))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // 2. Discrete Permission Check (PBAC)
        if (context.User.HasClaim(c => c.Type == "permission" && string.Equals(c.Value, requirement.Permission, StringComparison.OrdinalIgnoreCase)) ||
            context.User.HasClaim(c => c.Type == "permissions" && string.Equals(c.Value, requirement.Permission, StringComparison.OrdinalIgnoreCase)))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
