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

        // 2. Base Self-Service Authentication Policies (Any valid authenticated user)
        if (requirement.Permission.StartsWith("auth.", StringComparison.OrdinalIgnoreCase) &&
            context.User.Identity?.IsAuthenticated == true)
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // 3. HRAdmin / CompanyAdmin Role Bypass for Tenant-Level Operations
        var isTenantAdmin = context.User.IsInRole("HRAdmin") ||
                            context.User.IsInRole("CompanyAdmin") ||
                            context.User.HasClaim(c => (c.Type == ClaimTypes.Role || c.Type == "role") && (c.Value == "HRAdmin" || c.Value == "CompanyAdmin"));

        if (isTenantAdmin && !requirement.Permission.StartsWith("superadmin.", StringComparison.OrdinalIgnoreCase))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // 4. Discrete Permission Check (PBAC)
        if (context.User.HasClaim(c => c.Type == "permission" && string.Equals(c.Value, requirement.Permission, StringComparison.OrdinalIgnoreCase)) ||
            context.User.HasClaim(c => c.Type == "permissions" && string.Equals(c.Value, requirement.Permission, StringComparison.OrdinalIgnoreCase)))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
