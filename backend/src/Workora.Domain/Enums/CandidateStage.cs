namespace Workora.Domain.Enums;

/// <summary>
/// Recruitment workflow stage of an applicant candidate.
/// </summary>
public enum CandidateStage
{
    /// <summary>
    /// Initial application submitted.
    /// </summary>
    Applied = 1,

    /// <summary>
    /// Resume / phone screening in progress.
    /// </summary>
    Screening = 2,

    /// <summary>
    /// One or more interviews scheduled/conducted.
    /// </summary>
    Interview = 3,

    /// <summary>
    /// Formal job offer extended.
    /// </summary>
    Offered = 4,

    /// <summary>
    /// Offer accepted and candidate hired.
    /// </summary>
    Hired = 5,

    /// <summary>
    /// Disqualified or rejected.
    /// </summary>
    Rejected = 6
}
