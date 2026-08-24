using Workora.Domain.Common;
using Workora.Domain.Enums;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a formal offer of employment extended to a candidate.
/// </summary>
public class JobOffer : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the candidate.
    /// </summary>
    public int CandidateId { get; private set; }

    /// <summary>
    /// Navigation property to the candidate.
    /// </summary>
    public Candidate Candidate { get; private set; } = null!;

    /// <summary>
    /// Annual or monthly compensation offered.
    /// </summary>
    public decimal OfferedSalary { get; private set; }

    /// <summary>
    /// Anticipated start date of employment.
    /// </summary>
    public DateOnly JoiningDate { get; private set; }

    /// <summary>
    /// Expiration deadline date of the job offer.
    /// </summary>
    public DateOnly ExpiryDate { get; private set; }

    /// <summary>
    /// Status of the offer.
    /// </summary>
    public OfferStatus Status { get; private set; } = OfferStatus.Draft;

    /// <summary>
    /// Timestamp when offer was formally dispatched.
    /// </summary>
    public DateTimeOffset? SentAt { get; private set; }

    /// <summary>
    /// Timestamp when candidate replied with acceptance/refusal.
    /// </summary>
    public DateTimeOffset? RespondedAt { get; private set; }

    /// <summary>
    /// Optional administrative remarks or offer clauses.
    /// </summary>
    public string? Notes { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private JobOffer() { }

    /// <summary>
    /// Creates a new JobOffer instance.
    /// </summary>
    public static JobOffer Create(
        int candidateId,
        decimal offeredSalary,
        DateOnly joiningDate,
        DateOnly expiryDate,
        string? notes = null)
    {
        return new JobOffer
        {
            CandidateId = candidateId,
            OfferedSalary = offeredSalary,
            JoiningDate = joiningDate,
            ExpiryDate = expiryDate,
            Notes = notes,
            Status = OfferStatus.Draft,
            IsActive = true
        };
    }

    /// <summary>
    /// Marks the offer as formally sent.
    /// </summary>
    public void MarkSent()
    {
        Status = OfferStatus.Sent;
        SentAt = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// Registers candidate acceptance.
    /// </summary>
    public void Accept()
    {
        Status = OfferStatus.Accepted;
        RespondedAt = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// Registers candidate refusal.
    /// </summary>
    public void Decline()
    {
        Status = OfferStatus.Declined;
        RespondedAt = DateTimeOffset.UtcNow;
    }
}
