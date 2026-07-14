using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;

namespace Workora.API.Policies;

/// <summary>
/// Dynamically provides authorization policies based on permission names.
/// </summary>
public class PermissionPolicyProvider : IAuthorizationPolicyProvider
{
    /// <summary>
    /// Gets the fallback authorization policy provider.
    /// </summary>
    public DefaultAuthorizationPolicyProvider FallbackPolicyProvider { get; }

    /// <summary>
    /// Initializes a new instance of the <see cref="PermissionPolicyProvider"/> class.
    /// </summary>
    /// <param name="options">The authorization options.</param>
    public PermissionPolicyProvider(IOptions<AuthorizationOptions> options)
    {
        FallbackPolicyProvider = new DefaultAuthorizationPolicyProvider(options);
    }

    /// <summary>
    /// Gets the default authorization policy.
    /// </summary>
    /// <returns>The default authorization policy.</returns>
    public Task<AuthorizationPolicy> GetDefaultPolicyAsync() => FallbackPolicyProvider.GetDefaultPolicyAsync();

    /// <summary>
    /// Gets the fallback authorization policy.
    /// </summary>
    /// <returns>The fallback authorization policy.</returns>
    public Task<AuthorizationPolicy?> GetFallbackPolicyAsync() => FallbackPolicyProvider.GetFallbackPolicyAsync();

    /// <summary>
    /// Gets a policy dynamically based on the policy name (treated as a permission).
    /// </summary>
    /// <param name="policyName">The name of the policy.</param>
    /// <returns>The matching authorization policy.</returns>
    public Task<AuthorizationPolicy?> GetPolicyAsync(string policyName)
    {
        // Simple heuristic: if the policy name contains a dot, assume it's a permission
        if (policyName.Contains("."))
        {
            var policy = new AuthorizationPolicyBuilder()
                .AddRequirements(new PermissionRequirement(policyName))
                .Build();
            return Task.FromResult<AuthorizationPolicy?>(policy);
        }

        return FallbackPolicyProvider.GetPolicyAsync(policyName);
    }
}
