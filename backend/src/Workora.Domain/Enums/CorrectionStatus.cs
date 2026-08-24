namespace Workora.Domain.Enums;

/// <summary>
/// Status of an attendance correction request.
/// </summary>
public enum CorrectionStatus
{
    /// <summary>
    /// Pending manager review.
    /// </summary>
    Pending = 1,

    /// <summary>
    /// Correction request approved and attendance amended.
    /// </summary>
    Approved = 2,

    /// <summary>
    /// Correction request rejected.
    /// </summary>
    Rejected = 3
}
