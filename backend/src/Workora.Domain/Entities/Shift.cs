using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a work schedule shift window.
/// </summary>
public class Shift : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the parent company.
    /// </summary>
    public int CompanyId { get; private set; }

    /// <summary>
    /// Optional branch ID for location-specific shifts.
    /// </summary>
    public int? BranchId { get; private set; }

    /// <summary>
    /// Name of the shift (e.g., "General Day Shift", "Night Shift").
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// Unique code for the shift.
    /// </summary>
    public string Code { get; private set; } = null!;

    /// <summary>
    /// Scheduled start time of the shift.
    /// </summary>
    public TimeOnly StartTime { get; private set; }

    /// <summary>
    /// Scheduled end time of the shift.
    /// </summary>
    public TimeOnly EndTime { get; private set; }

    /// <summary>
    /// Indicates whether the shift spans across midnight into the next day.
    /// </summary>
    public bool SpansMidnight { get; private set; }

    /// <summary>
    /// Grace period in minutes allowed after start time before late marking.
    /// </summary>
    public int GracePeriodMinutes { get; private set; } = 15;

    /// <summary>
    /// Scheduled total break time in minutes.
    /// </summary>
    public int BreakMinutes { get; private set; } = 60;

    /// <summary>
    /// Brief description of the shift.
    /// </summary>
    public string? Description { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Shift() { }

    /// <summary>
    /// Creates a new Shift instance.
    /// </summary>
    public static Shift Create(
        int companyId,
        string name,
        string code,
        TimeOnly startTime,
        TimeOnly endTime,
        bool spansMidnight = false,
        int gracePeriodMinutes = 15,
        int breakMinutes = 60,
        int? branchId = null,
        string? description = null)
    {
        return new Shift
        {
            CompanyId = companyId,
            Name = name,
            Code = code.ToUpperInvariant(),
            StartTime = startTime,
            EndTime = endTime,
            SpansMidnight = spansMidnight,
            GracePeriodMinutes = gracePeriodMinutes,
            BreakMinutes = breakMinutes,
            BranchId = branchId,
            Description = description,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates shift details.
    /// </summary>
    public void Update(
        string name,
        string code,
        TimeOnly startTime,
        TimeOnly endTime,
        bool spansMidnight,
        int gracePeriodMinutes,
        int breakMinutes,
        int? branchId,
        string? description)
    {
        Name = name;
        Code = code.ToUpperInvariant();
        StartTime = startTime;
        EndTime = endTime;
        SpansMidnight = spansMidnight;
        GracePeriodMinutes = gracePeriodMinutes;
        BreakMinutes = breakMinutes;
        BranchId = branchId;
        Description = description;
    }
}
