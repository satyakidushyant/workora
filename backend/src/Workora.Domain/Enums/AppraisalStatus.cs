namespace Workora.Domain.Enums;

/// <summary>
/// Lifecycle status of an employee performance review appraisal.
/// </summary>
public enum AppraisalStatus
{
    /// <summary>
    /// Initial draft or appraisal period created.
    /// </summary>
    Draft = 1,

    /// <summary>
    /// Awaiting employee self-assessment.
    /// </summary>
    PendingSelfReview = 2,

    /// <summary>
    /// Awaiting reporting manager evaluation.
    /// </summary>
    PendingManagerReview = 3,

    /// <summary>
    /// Review completed and finalized with score.
    /// </summary>
    Finalized = 4
}
