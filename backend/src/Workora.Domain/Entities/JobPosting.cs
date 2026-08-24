using Workora.Domain.Common;
using Workora.Domain.Enums;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a job vacancy listing for talent acquisition.
/// </summary>
public class JobPosting : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the company.
    /// </summary>
    public int CompanyId { get; private set; }

    /// <summary>
    /// Foreign key identifier for the department.
    /// </summary>
    public int DepartmentId { get; private set; }

    /// <summary>
    /// Navigation property to the department.
    /// </summary>
    public Department Department { get; private set; } = null!;

    /// <summary>
    /// Title of the job vacancy.
    /// </summary>
    public string Title { get; private set; } = null!;

    /// <summary>
    /// Detailed job description and responsibilities.
    /// </summary>
    public string Description { get; private set; } = null!;

    /// <summary>
    /// Qualifications and skills required.
    /// </summary>
    public string Requirements { get; private set; } = null!;

    /// <summary>
    /// Full-time, contract, internship, etc.
    /// </summary>
    public EmploymentType EmploymentType { get; private set; } = EmploymentType.FullTime;

    /// <summary>
    /// Physical location or Remote indication.
    /// </summary>
    public string Location { get; private set; } = null!;

    /// <summary>
    /// Minimum years of relevant experience.
    /// </summary>
    public int ExperienceYearsMin { get; private set; }

    /// <summary>
    /// Maximum years of relevant experience.
    /// </summary>
    public int ExperienceYearsMax { get; private set; }

    /// <summary>
    /// Minimum advertised salary range.
    /// </summary>
    public decimal? SalaryMin { get; private set; }

    /// <summary>
    /// Maximum advertised salary range.
    /// </summary>
    public decimal? SalaryMax { get; private set; }

    /// <summary>
    /// Publishing state of the vacancy.
    /// </summary>
    public JobStatus Status { get; private set; } = JobStatus.Draft;

    /// <summary>
    /// Application deadline date.
    /// </summary>
    public DateOnly? ClosingDate { get; private set; }

    private readonly List<Candidate> _candidates = new();
    /// <summary>
    /// Collection of applicants for this posting.
    /// </summary>
    public IReadOnlyCollection<Candidate> Candidates => _candidates.AsReadOnly();

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private JobPosting() { }

    /// <summary>
    /// Creates a new JobPosting instance.
    /// </summary>
    public static JobPosting Create(
        int companyId,
        int departmentId,
        string title,
        string description,
        string requirements,
        EmploymentType employmentType,
        string location,
        int experienceYearsMin,
        int experienceYearsMax,
        decimal? salaryMin = null,
        decimal? salaryMax = null,
        DateOnly? closingDate = null)
    {
        return new JobPosting
        {
            CompanyId = companyId,
            DepartmentId = departmentId,
            Title = title,
            Description = description,
            Requirements = requirements,
            EmploymentType = employmentType,
            Location = location,
            ExperienceYearsMin = experienceYearsMin,
            ExperienceYearsMax = experienceYearsMax,
            SalaryMin = salaryMin,
            SalaryMax = salaryMax,
            ClosingDate = closingDate,
            Status = JobStatus.Draft,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates the vacancy details.
    /// </summary>
    public void Update(
        int departmentId,
        string title,
        string description,
        string requirements,
        EmploymentType employmentType,
        string location,
        int experienceYearsMin,
        int experienceYearsMax,
        decimal? salaryMin,
        decimal? salaryMax,
        DateOnly? closingDate)
    {
        DepartmentId = departmentId;
        Title = title;
        Description = description;
        Requirements = requirements;
        EmploymentType = employmentType;
        Location = location;
        ExperienceYearsMin = experienceYearsMin;
        ExperienceYearsMax = experienceYearsMax;
        SalaryMin = salaryMin;
        SalaryMax = salaryMax;
        ClosingDate = closingDate;
    }

    /// <summary>
    /// Publishes the job opening.
    /// </summary>
    public void Publish()
    {
        Status = JobStatus.Published;
    }

    /// <summary>
    /// Closes the job vacancy.
    /// </summary>
    public void Close()
    {
        Status = JobStatus.Closed;
    }
}
