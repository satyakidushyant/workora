using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a job title/designation within a department.
/// </summary>
public class Designation : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the department.
    /// </summary>
    public int DepartmentId { get; private set; }

    /// <summary>
    /// The department navigation property.
    /// </summary>
    public Department Department { get; private set; } = null!;

    /// <summary>
    /// The designation title (e.g. "Senior Software Engineer").
    /// </summary>
    public string Title { get; private set; } = null!;

    /// <summary>
    /// The organizational seniority level (1 = junior, 5 = senior, etc.).
    /// </summary>
    public int Level { get; private set; } = 1;

    /// <summary>
    /// The salary/job grade (e.g. "G1", "L4").
    /// </summary>
    public string? Grade { get; private set; }

    /// <summary>
    /// A brief description of the role responsibilities.
    /// </summary>
    public string? Description { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Designation() { }

    /// <summary>
    /// Creates a new Designation instance.
    /// </summary>
    public static Designation Create(
        int departmentId,
        string title,
        int level = 1,
        string? grade = null,
        string? description = null)
    {
        return new Designation
        {
            DepartmentId = departmentId,
            Title = title,
            Level = level,
            Grade = grade,
            Description = description,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates the designation details.
    /// </summary>
    public void Update(int departmentId, string title, int level, string? grade, string? description)
    {
        DepartmentId = departmentId;
        Title = title;
        Level = level;
        Grade = grade;
        Description = description;
    }
}
