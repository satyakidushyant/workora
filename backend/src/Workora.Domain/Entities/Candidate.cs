using Workora.Domain.Common;
using Workora.Domain.Enums;
using Workora.Domain.ValueObjects;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents an applicant candidate applying for a job opening.
/// </summary>
public class Candidate : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the job posting.
    /// </summary>
    public int JobPostingId { get; private set; }

    /// <summary>
    /// Navigation property to the job posting.
    /// </summary>
    public JobPosting JobPosting { get; private set; } = null!;

    /// <summary>
    /// First name.
    /// </summary>
    public string FirstName { get; private set; } = null!;

    /// <summary>
    /// Last name.
    /// </summary>
    public string LastName { get; private set; } = null!;

    /// <summary>
    /// Candidate email contact address.
    /// </summary>
    public EmailAddress Email { get; private set; } = null!;

    /// <summary>
    /// Telephone contact number.
    /// </summary>
    public string? Phone { get; private set; }

    /// <summary>
    /// Path or storage URL of the uploaded resume document.
    /// </summary>
    public string? ResumeUrl { get; private set; }

    /// <summary>
    /// Current pipeline recruitment stage.
    /// </summary>
    public CandidateStage Stage { get; private set; } = CandidateStage.Applied;

    /// <summary>
    /// Optional rejection reason if disqualified.
    /// </summary>
    public string? RejectionReason { get; private set; }

    /// <summary>
    /// Timestamp when application was received.
    /// </summary>
    public DateTimeOffset AppliedDate { get; private set; }

    private readonly List<Interview> _interviews = new();
    /// <summary>
    /// Collection of interview rounds.
    /// </summary>
    public IReadOnlyCollection<Interview> Interviews => _interviews.AsReadOnly();

    private readonly List<JobOffer> _offers = new();
    /// <summary>
    /// Collection of extended job offers.
    /// </summary>
    public IReadOnlyCollection<JobOffer> Offers => _offers.AsReadOnly();

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Candidate() { }

    /// <summary>
    /// Creates a new Candidate application.
    /// </summary>
    public static Candidate Create(
        int jobPostingId,
        string firstName,
        string lastName,
        EmailAddress email,
        string? phone = null,
        string? resumeUrl = null)
    {
        return new Candidate
        {
            JobPostingId = jobPostingId,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            Phone = phone,
            ResumeUrl = resumeUrl,
            Stage = CandidateStage.Applied,
            AppliedDate = DateTimeOffset.UtcNow,
            IsActive = true
        };
    }

    /// <summary>
    /// Advances or updates the candidate's recruitment stage.
    /// </summary>
    public void MoveStage(CandidateStage newStage)
    {
        Stage = newStage;
    }

    /// <summary>
    /// Disqualifies/rejects the candidate.
    /// </summary>
    public void Reject(string? reason = null)
    {
        Stage = CandidateStage.Rejected;
        RejectionReason = reason;
    }
}
