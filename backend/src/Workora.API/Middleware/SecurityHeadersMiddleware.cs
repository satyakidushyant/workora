namespace Workora.API.Middleware;

/// <summary>
/// Middleware to automatically append security headers to every HTTP response.
/// </summary>
public class SecurityHeadersMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<SecurityHeadersMiddleware> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="SecurityHeadersMiddleware"/> class.
    /// </summary>
    /// <param name="next">The next request delegate in the pipeline.</param>
    /// <param name="logger">The logger instance.</param>
    public SecurityHeadersMiddleware(RequestDelegate next, ILogger<SecurityHeadersMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    /// <summary>
    /// Invokes the middleware to append security headers.
    /// </summary>
    /// <param name="context">The HTTP context.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            context.Response.OnStarting(() =>
            {
                if (!context.Response.Headers.ContainsKey("X-Frame-Options"))
                {
                    context.Response.Headers.Append("X-Frame-Options", "DENY");
                }
                if (!context.Response.Headers.ContainsKey("X-Content-Type-Options"))
                {
                    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
                }
                if (!context.Response.Headers.ContainsKey("X-XSS-Protection"))
                {
                    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
                }
                if (!context.Response.Headers.ContainsKey("Referrer-Policy"))
                {
                    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
                }

                return Task.CompletedTask;
            });

            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while appending security headers.");
            throw;
        }
    }
}
