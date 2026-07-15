using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Workora.Application.Common.Interfaces;

namespace Workora.API.Services;

/// <summary>
/// Service implementation that retrieves current user context from HTTP Context.
/// </summary>
public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    /// <summary>
    /// Initializes a new instance of the <see cref="CurrentUserService"/> class.
    /// </summary>
    /// <param name="httpContextAccessor">The HTTP context accessor.</param>
    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    /// <summary>
    /// Gets the unique identifier of the current user.
    /// </summary>
    public Guid? UserId
    {
        get
        {
            var userIdStr = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value
                             ?? _httpContextAccessor.HttpContext?.User?.FindFirst("sub")?.Value;

            if (Guid.TryParse(userIdStr, out var parsedGuid))
            {
                return parsedGuid;
            }

            return null;
        }
    }

    /// <summary>
    /// Gets a value indicating whether the user is authenticated.
    /// </summary>
    public bool IsAuthenticated => _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;

    /// <summary>
    /// Checks if the current user belongs to the specified role.
    /// </summary>
    /// <param name="roleName">The name of the role.</param>
    /// <returns>True if the user is in the role; otherwise, false.</returns>
    public bool IsInRole(string roleName)
    {
        return _httpContextAccessor.HttpContext?.User?.IsInRole(roleName) ?? false;
    }

    /// <summary>
    /// Checks if the current user has the specified permission.
    /// </summary>
    /// <param name="permission">The permission name.</param>
    /// <returns>True if the user has the permission claim; otherwise, false.</returns>
    public bool HasPermission(string permission)
    {
        return _httpContextAccessor.HttpContext?.User?.HasClaim(c => c.Type == "permission" && c.Value == permission) ?? false;
    }
}
