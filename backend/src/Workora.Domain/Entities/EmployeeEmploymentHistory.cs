using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Records historical events in an employee's career (transfers, promotions, department changes).
/// </summary>
public class EmployeeEmploymentHistory : BaseEntity
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
    /// The effective date of the career change event.
    /// </summary>
    public DateOnly EffectiveDate { get; private set; }

    /// <summary>
    /// The category of event (e.g., "Hire", "Transfer", "Promotion", "Termination", "Rehire").
    /// </summary>
    public string EventType { get; private set; } = null!;

    /// <summary>
    /// Previous department ID.
    /// </summary>
    public int? PreviousDepartmentId { get; private set; }

    /// <summary>
    /// New department ID.
    /// </summary>
    public int? NewDepartmentId { get; private set; }

    /// <summary>
    /// Previous designation ID.
    /// </summary>
    public int? PreviousDesignationId { get; private set; }

    /// <summary>
    /// New designation ID.
    /// </summary>
    public int? NewDesignationId { get; private set; }

    /// <summary>
    /// Previous branch ID.
    /// </summary>
    public int? PreviousBranchId { get; private set; }

    /// <summary>
    /// New branch ID.
    /// </summary>
    public int? NewBranchId { get; private set; }

    /// <summary>
    /// Optional administrative notes regarding the transition.
    /// </summary>
    public string? Notes { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private EmployeeEmploymentHistory() { }

    /// <summary>
    /// Creates a new EmployeeEmploymentHistory instance.
    /// </summary>
    public static EmployeeEmploymentHistory Create(
        int employeeId,
        DateOnly effectiveDate,
        string eventType,
        int? previousDepartmentId,
        int? newDepartmentId,
        int? previousDesignationId,
        int? newDesignationId,
        int? previousBranchId,
        int? newBranchId,
        string? notes = null)
    {
        return new EmployeeEmploymentHistory
        {
            EmployeeId = employeeId,
            EffectiveDate = effectiveDate,
            EventType = eventType,
            PreviousDepartmentId = previousDepartmentId,
            NewDepartmentId = newDepartmentId,
            PreviousDesignationId = previousDesignationId,
            NewDesignationId = newDesignationId,
            PreviousBranchId = previousBranchId,
            NewBranchId = newBranchId,
            Notes = notes,
            IsActive = true
        };
    }
}
