using Workora.Domain.Common;
using Workora.Domain.Enums;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a training course or professional development workshop.
/// </summary>
public class TrainingProgram : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the parent company.
    /// </summary>
    public int CompanyId { get; private set; }

    /// <summary>
    /// Title of the training program.
    /// </summary>
    public string Title { get; private set; } = null!;

    /// <summary>
    /// Detailed course syllabus or objective description.
    /// </summary>
    public string Description { get; private set; } = null!;

    /// <summary>
    /// Instructor or training vendor organization.
    /// </summary>
    public string TrainerName { get; private set; } = null!;

    /// <summary>
    /// Program start date.
    /// </summary>
    public DateOnly StartDate { get; private set; }

    /// <summary>
    /// Program end date.
    /// </summary>
    public DateOnly EndDate { get; private set; }

    /// <summary>
    /// Maximum seating capacity.
    /// </summary>
    public int Capacity { get; private set; }

    private readonly List<TrainingEnrollment> _enrollments = new();
    /// <summary>
    /// Collection of employee enrollments.
    /// </summary>
    public IReadOnlyCollection<TrainingEnrollment> Enrollments => _enrollments.AsReadOnly();

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private TrainingProgram() { }

    /// <summary>
    /// Creates a new TrainingProgram instance.
    /// </summary>
    public static TrainingProgram Create(
        int companyId,
        string title,
        string description,
        string trainerName,
        DateOnly startDate,
        DateOnly endDate,
        int capacity)
    {
        return new TrainingProgram
        {
            CompanyId = companyId,
            Title = title,
            Description = description,
            TrainerName = trainerName,
            StartDate = startDate,
            EndDate = endDate,
            Capacity = capacity,
            IsActive = true
        };
    }
}

/// <summary>
/// Represents an employee's enrollment in a training program.
/// </summary>
public class TrainingEnrollment : BaseEntity
{
    /// <summary>
    /// Foreign key identifier for the training program.
    /// </summary>
    public int TrainingProgramId { get; private set; }

    /// <summary>
    /// Navigation property to the training program.
    /// </summary>
    public TrainingProgram TrainingProgram { get; private set; } = null!;

    /// <summary>
    /// Foreign key identifier for the employee.
    /// </summary>
    public int EmployeeId { get; private set; }

    /// <summary>
    /// Navigation property to the employee.
    /// </summary>
    public Employee Employee { get; private set; } = null!;

    /// <summary>
    /// Current enrollment / progress status.
    /// </summary>
    public TrainingStatus Status { get; private set; } = TrainingStatus.Enrolled;

    /// <summary>
    /// Timestamp when program was completed.
    /// </summary>
    public DateTimeOffset? CompletedAt { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private TrainingEnrollment() { }

    /// <summary>
    /// Creates a new TrainingEnrollment instance.
    /// </summary>
    public static TrainingEnrollment Create(int trainingProgramId, int employeeId)
    {
        return new TrainingEnrollment
        {
            TrainingProgramId = trainingProgramId,
            EmployeeId = employeeId,
            Status = TrainingStatus.Enrolled,
            IsActive = true
        };
    }

    /// <summary>
    /// Marks the training program as completed.
    /// </summary>
    public void Complete()
    {
        Status = TrainingStatus.Completed;
        CompletedAt = DateTimeOffset.UtcNow;
    }
}
