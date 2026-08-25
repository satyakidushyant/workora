namespace Workora.Domain.Exceptions;

/// <summary>
/// Exception thrown when domain business rules or invariants are violated.
/// </summary>
public class DomainException : Exception
{
    /// <summary>
    /// Initializes a new instance of the <see cref="DomainException"/> class.
    /// </summary>
    /// <param name="message">The exception error message.</param>
    public DomainException(string message) : base(message)
    {
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="DomainException"/> class with an inner exception.
    /// </summary>
    /// <param name="message">The exception error message.</param>
    /// <param name="innerException">The inner exception.</param>
    public DomainException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
