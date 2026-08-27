using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a financial year configuration for a company.
/// </summary>
public class FinancialYear : AuditableEntity
{
    /// <summary>
    /// The display name (e.g., "FY 2026-2027").
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// The start date of the financial year.
    /// </summary>
    public DateOnly StartDate { get; private set; }

    /// <summary>
    /// The end date of the financial year (inclusive).
    /// </summary>
    public DateOnly EndDate { get; private set; }

    /// <summary>
    /// Whether this is the currently active financial year.
    /// </summary>
    public bool IsCurrent { get; private set; } = false;

    /// <summary>
    /// Whether this financial year has been closed for edits.
    /// </summary>
    public bool IsClosed { get; private set; } = false;

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private FinancialYear() { }

    /// <summary>
    /// Creates a new FinancialYear instance.
    /// </summary>
    public static FinancialYear Create(string name, DateOnly startDate, DateOnly endDate, bool isCurrent = false)
    {
        return new FinancialYear
        {
            Name = name,
            StartDate = startDate,
            EndDate = endDate,
            IsCurrent = isCurrent,
            IsClosed = false,
            IsActive = true
        };
    }

    /// <summary>
    /// Marks this financial year as the active one.
    /// </summary>
    public void SetAsCurrent()
    {
        IsCurrent = true;
    }

    /// <summary>
    /// Unmarks this financial year as current.
    /// </summary>
    public void UnsetCurrent()
    {
        IsCurrent = false;
    }

    /// <summary>
    /// Closes the financial year, preventing further edits.
    /// </summary>
    public void Close()
    {
        IsClosed = true;
        IsCurrent = false;
    }
}