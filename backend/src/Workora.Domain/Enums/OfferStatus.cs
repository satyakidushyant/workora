namespace Workora.Domain.Enums;

/// <summary>
/// Status of an employment job offer.
/// </summary>
public enum OfferStatus
{
    /// <summary>
    /// Prepared in draft by HR.
    /// </summary>
    Draft = 1,

    /// <summary>
    /// Formally dispatched to the candidate.
    /// </summary>
    Sent = 2,

    /// <summary>
    /// Accepted by the candidate.
    /// </summary>
    Accepted = 3,

    /// <summary>
    /// Declined by the candidate.
    /// </summary>
    Declined = 4
}
