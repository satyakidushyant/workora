using Workora.Domain.Common;
using Workora.Domain.Enums;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a company or regional holiday.
/// </summary>
public class Holiday : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the company.
    /// </summary>
    public int CompanyId { get; private set; }

    /// <summary>
    /// Optional foreign key identifier for branch-specific holidays (null = company wide).
    /// </summary>
    public int? BranchId { get; private set; }

    /// <summary>
    /// Navigation property to branch.
    /// </summary>
    public Branch? Branch { get; private set; }

    /// <summary>
    /// Name / title of the holiday.
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// The date of the holiday observance.
    /// </summary>
    public DateOnly Date { get; private set; }

    /// <summary>
    /// Classification of the holiday.
    /// </summary>
    public HolidayType Type { get; private set; } = HolidayType.Public;

    /// <summary>
    /// Description or additional notes.
    /// </summary>
    public string? Description { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Holiday() { }

    /// <summary>
    /// Creates a new Holiday instance.
    /// </summary>
    public static Holiday Create(
        int companyId,
        string name,
        DateOnly date,
        HolidayType type = HolidayType.Public,
        int? branchId = null,
        string? description = null)
    {
        return new Holiday
        {
            CompanyId = companyId,
            Name = name,
            Date = date,
            Type = type,
            BranchId = branchId,
            Description = description,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates the holiday details.
    /// </summary>
    public void Update(string name, DateOnly date, HolidayType type, int? branchId, string? description)
    {
        Name = name;
        Date = date;
        Type = type;
        BranchId = branchId;
        Description = description;
    }
}
