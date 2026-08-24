namespace Workora.Domain.Enums;

/// <summary>
/// Status of a job vacancy posting.
/// </summary>
public enum JobStatus
{
    /// <summary>
    /// Draft vacancy not yet advertised.
    /// </summary>
    Draft = 1,

    /// <summary>
    /// Actively open and receiving applications.
    /// </summary>
    Published = 2,

    /// <summary>
    /// Closed to new applicants.
    /// </summary>
    Closed = 3
}
