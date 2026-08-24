using Workora.Domain.Common;
using Workora.Domain.Enums;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a performance appraisal review period for an employee.
/// </summary>
public class Appraisal : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the employee being reviewed.
    /// </summary>
    public int EmployeeId { get; private set; }

    /// <summary>
    /// Navigation property to the employee.
    /// </summary>
    public Employee Employee { get; private set; } = null!;

    /// <summary>
    /// Foreign key identifier for the reviewing manager.
    /// </summary>
    public int ReviewerEmployeeId { get; private set; }

    /// <summary>
    /// Navigation property to the reviewing manager.
    /// </summary>
    public Employee Reviewer { get; private set; } = null!;

    /// <summary>
    /// Review period title (e.g. "Q1 2026", "Annual 2026").
    /// </summary>
    public string Period { get; private set; } = null!;

    /// <summary>
    /// Cycle year.
    /// </summary>
    public int Year { get; private set; }

    /// <summary>
    /// Current workflow review status.
    /// </summary>
    public AppraisalStatus Status { get; private set; } = AppraisalStatus.PendingSelfReview;

    /// <summary>
    /// Qualitative self-assessment feedback provided by the employee.
    /// </summary>
    public string? SelfReviewComments { get; private set; }

    /// <summary>
    /// Self-assessment rating score (1 to 5).
    /// </summary>
    public int? SelfReviewRating { get; private set; }

    /// <summary>
    /// Reviewer / manager evaluation notes.
    /// </summary>
    public string? ManagerReviewComments { get; private set; }

    /// <summary>
    /// Reviewer / manager rating score (1 to 5).
    /// </summary>
    public int? ManagerReviewRating { get; private set; }

    /// <summary>
    /// Final negotiated performance score (1 to 5).
    /// </summary>
    public decimal? FinalScore { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Appraisal() { }

    /// <summary>
    /// Creates a new Appraisal review cycle.
    /// </summary>
    public static Appraisal Create(
        int employeeId,
        int reviewerEmployeeId,
        string period,
        int year)
    {
        return new Appraisal
        {
            EmployeeId = employeeId,
            ReviewerEmployeeId = reviewerEmployeeId,
            Period = period,
            Year = year,
            Status = AppraisalStatus.PendingSelfReview,
            IsActive = true
        };
    }

    /// <summary>
    /// Submits employee self-assessment.
    /// </summary>
    public void SubmitSelfReview(string comments, int rating)
    {
        SelfReviewComments = comments;
        SelfReviewRating = Math.Clamp(rating, 1, 5);
        Status = AppraisalStatus.PendingManagerReview;
    }

    /// <summary>
    /// Submits manager evaluation.
    /// </summary>
    public void SubmitManagerReview(string comments, int rating)
    {
        ManagerReviewComments = comments;
        ManagerReviewRating = Math.Clamp(rating, 1, 5);
    }

    /// <summary>
    /// Finalizes the appraisal cycle with a composite score.
    /// </summary>
    public void FinalizeAppraisal(decimal finalScore)
    {
        FinalScore = Math.Clamp(finalScore, 1, 5);
        Status = AppraisalStatus.Finalized;
    }
}

/// <summary>
/// Represents an employee's Key Performance Indicator (KPI) or professional goal.
/// </summary>
public class Goal : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the employee.
    /// </summary>
    public int EmployeeId { get; private set; }

    /// <summary>
    /// Navigation property to the employee.
    /// </summary>
    public Employee Employee { get; private set; } = null!;

    /// <summary>
    /// Title of the goal / KPI.
    /// </summary>
    public string Title { get; private set; } = null!;

    /// <summary>
    /// Detailed description of milestones and success metrics.
    /// </summary>
    public string Description { get; private set; } = null!;

    /// <summary>
    /// Target completion deadline date.
    /// </summary>
    public DateOnly TargetDate { get; private set; }

    /// <summary>
    /// Completion progress percentage (0 to 100).
    /// </summary>
    public int ProgressPercentage { get; private set; }

    /// <summary>
    /// Current goal state.
    /// </summary>
    public GoalStatus Status { get; private set; } = GoalStatus.InProgress;

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Goal() { }

    /// <summary>
    /// Creates a new Goal instance.
    /// </summary>
    public static Goal Create(
        int employeeId,
        string title,
        string description,
        DateOnly targetDate)
    {
        return new Goal
        {
            EmployeeId = employeeId,
            Title = title,
            Description = description,
            TargetDate = targetDate,
            ProgressPercentage = 0,
            Status = GoalStatus.InProgress,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates the goal's progress percentage and status.
    /// </summary>
    public void UpdateProgress(int progressPercentage, GoalStatus status)
    {
        ProgressPercentage = Math.Clamp(progressPercentage, 0, 100);
        Status = status;
        if (ProgressPercentage >= 100)
        {
            Status = GoalStatus.Completed;
        }
    }
}
