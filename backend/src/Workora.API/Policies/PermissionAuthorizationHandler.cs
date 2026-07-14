using Microsoft.AspNetCore.Authorization;

namespace Workora.API.Policies;

/// <summary>
/// Evaluates whether the current user satisfies a given PermissionRequirement.
/// </summary>
public class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    /// <summary>
    /// Evaluates the authorization requirement asynchronously.
    /// </summary>
    /// <param name="context">The authorization handler context.</param>
    /// <param name="requirement">The permission requirement to evaluate.</param>
    /// <returns>A task that represents the asynchronous evaluation operation.</returns>
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        if (context.User.HasClaim(c => c.Type == "permission" && c.Value == requirement.Permission))
        {
            context.Succeed(requirement);
        }
        return Task.CompletedTask;
    }
}
