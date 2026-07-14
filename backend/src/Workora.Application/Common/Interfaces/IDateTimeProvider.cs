namespace Workora.Application.Common.Interfaces;

/// <summary>
/// Defines the contract for retrieving current date and time information.
/// </summary>
public interface IDateTimeProvider
{
    /// <summary>
    /// Gets the current date and time in Coordinated Universal Time (UTC).
    /// </summary>
    DateTimeOffset UtcNow { get; }
}
