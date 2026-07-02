namespace Workora.Application.Common.Exceptions;

/// <summary>
/// Custom exception for unauthorized access attempts.
/// </summary>
public class UnauthorizedException : Exception
{
    /// <summary>
    /// Initializes a new instance of the <see cref="UnauthorizedException"/> class.
    /// </summary>
    /// <param name="message">The exception message.</param>
    public UnauthorizedException(string message) : base(message)
    {
    }
}
