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

    /// <summary>
    /// Initializes a new instance of the <see cref="UserContextMiddleware"/> class.
    /// </summary>
    /// <param name="next">The next request delegate in the pipeline.</param>
    /// <param name="logger">The logger instance.</param>
    public UserContextMiddleware(RequestDelegate next, ILogger<UserContextMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    /// <summary>
    /// Invokes the middleware to extract user context.
    /// </summary>
    /// <param name="context">The HTTP context.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
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
