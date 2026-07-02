using System.Security.Claims;
using NLog;

namespace Workora.API.Middleware;

/// <summary>
/// Extracts user information from the request context and pushes it to NLog's MDLC.
/// </summary>
public class UserContextMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<UserContextMiddleware> _logger;

    public UserContextMiddleware(RequestDelegate next, ILogger<UserContextMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            var userId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                         ?? context.User?.FindFirst("sub")?.Value 
                         ?? "Anonymous";

            // Push the user ID into the NLog ScopeContext so it can be logged in every message
            using (ScopeContext.PushProperty("UserId", userId))
            {
                await _next(context);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while pushing UserContext properties.");
            throw;
        }
    }
}
