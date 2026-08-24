using Workora.Domain.Common;
using Workora.Domain.Enums;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents an interview evaluation round scheduled with a candidate.
/// </summary>
public class Interview : AuditableEntity
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
    /// Foreign key identifier for the employee conducting the interview.
    /// </summary>
    public int InterviewerEmployeeId { get; private set; }

    /// <summary>
    /// Navigation property to the interviewer employee.
    /// </summary>
    public Employee Interviewer { get; private set; } = null!;

    /// <summary>
    /// Scheduled date and time for the interview.
    /// </summary>
    public DateTimeOffset ScheduledAt { get; private set; }

    /// <summary>
    /// Meeting location, room name, or video call link.
    /// </summary>
    public string LocationOrLink { get; private set; } = null!;

    /// <summary>
    /// Status of the interview.
    /// </summary>
    public InterviewStatus Status { get; private set; } = InterviewStatus.Scheduled;

    /// <summary>
    /// Post-interview qualitative assessment feedback.
    /// </summary>
    public string? Feedback { get; private set; }

    /// <summary>
    /// Candidate rating score (1 to 5 stars).
    /// </summary>
    public int? Rating { get; private set; }

    /// <summary>
    /// Timestamp when feedback was submitted.
    /// </summary>
    public DateTimeOffset? ConductedAt { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Interview() { }

    /// <summary>
    /// Schedules a new interview round.
    /// </summary>
    public static Interview Create(
        int candidateId,
        int interviewerEmployeeId,
        DateTimeOffset scheduledAt,
        string locationOrLink)
    {
        return new Interview
        {
            CandidateId = candidateId,
            InterviewerEmployeeId = interviewerEmployeeId,
            ScheduledAt = scheduledAt,
            LocationOrLink = locationOrLink,
            Status = InterviewStatus.Scheduled,
            IsActive = true
        };
    }

    /// <summary>
    /// Submits interview feedback and numerical rating.
    /// </summary>
    public void SubmitFeedback(string feedback, int rating)
    {
        Feedback = feedback;
        Rating = Math.Clamp(rating, 1, 5);
        Status = InterviewStatus.Completed;
        ConductedAt = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// Cancels the scheduled interview.
    /// </summary>
    public void Cancel()
    {
        Status = InterviewStatus.Cancelled;
    }
}
