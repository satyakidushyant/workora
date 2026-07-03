using System.Diagnostics;
using System.Text;

namespace Workora.API.Middleware;

/// <summary>
/// Middleware to log HTTP request paths, methods, status codes, execution durations, and payloads.
/// </summary>
public class RequestResponseLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestResponseLoggingMiddleware> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="RequestResponseLoggingMiddleware"/> class.
    /// </summary>
    /// <param name="next">The next request delegate in the pipeline.</param>
    /// <param name="logger">The logger instance.</param>
    public RequestResponseLoggingMiddleware(RequestDelegate next, ILogger<RequestResponseLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    /// <summary>
    /// Invokes the middleware to log the request and response.
    /// </summary>
    /// <param name="context">The HTTP context.</param>
    /// <returns>A task representing the asynchronous operation.</returns>
    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            var requestBody = await ReadRequestBodyAsync(context.Request);
            
            // Mask password payloads
            if (context.Request.Path.Value?.Contains("/auth/login", StringComparison.OrdinalIgnoreCase) == true ||
                context.Request.Path.Value?.Contains("/auth/reset-password", StringComparison.OrdinalIgnoreCase) == true ||
                context.Request.Path.Value?.Contains("/auth/change-password", StringComparison.OrdinalIgnoreCase) == true)
            {
                requestBody = "[REDACTED FOR SECURITY]";
            }

            _logger.LogInformation("HTTP Request: {Method} {Path} | Body: {Body}", 
                context.Request.Method, context.Request.Path, requestBody);

            var originalBodyStream = context.Response.Body;
            using var responseBody = new MemoryStream();
            context.Response.Body = responseBody;

            await _next(context);

            stopwatch.Stop();

            var responseBodyText = await ReadResponseBodyAsync(context.Response);

            _logger.LogInformation(
                "HTTP Response: {Method} {Path} responded {StatusCode} in {ElapsedMilliseconds} ms | Body: {Body}",
                context.Request.Method,
                context.Request.Path,
                context.Response.StatusCode,
                stopwatch.ElapsedMilliseconds,
                responseBodyText);

            await responseBody.CopyToAsync(originalBodyStream);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred during request/response logging.");
            throw; // Re-throw to allow GlobalExceptionMiddleware to handle it
        }
    }

    /// <summary>
    /// Reads the request body safely for logging.
    /// </summary>
    /// <param name="request">The HTTP request.</param>
    /// <returns>The request body as a string.</returns>
    private async Task<string> ReadRequestBodyAsync(HttpRequest request)
    {
        request.EnableBuffering();
        using var streamReader = new StreamReader(request.Body, Encoding.UTF8, leaveOpen: true);
        var body = await streamReader.ReadToEndAsync();
        request.Body.Position = 0;
        return string.IsNullOrWhiteSpace(body) ? "[Empty]" : body;
    }

    /// <summary>
    /// Reads the response body safely for logging.
    /// </summary>
    /// <param name="response">The HTTP response.</param>
    /// <returns>The response body as a string.</returns>
    private async Task<string> ReadResponseBodyAsync(HttpResponse response)
    {
        response.Body.Seek(0, SeekOrigin.Begin);
        using var streamReader = new StreamReader(response.Body, Encoding.UTF8, leaveOpen: true);
        var body = await streamReader.ReadToEndAsync();
        response.Body.Seek(0, SeekOrigin.Begin);
        return string.IsNullOrWhiteSpace(body) ? "[Empty]" : body;
    }
}
