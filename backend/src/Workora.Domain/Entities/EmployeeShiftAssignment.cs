using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents the assignment of a shift schedule to an employee.
/// </summary>
public class EmployeeShiftAssignment : BaseEntity
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
    /// Foreign key identifier for the assigned shift.
    /// </summary>
    public int ShiftId { get; private set; }

    /// <summary>
    /// Navigation property to the assigned shift.
    /// </summary>
    public Shift Shift { get; private set; } = null!;

    /// <summary>
    /// The starting effective date of the shift assignment.
    /// </summary>
    public DateOnly EffectiveFrom { get; private set; }

    /// <summary>
    /// The ending date of the shift assignment, if bounded.
    /// </summary>
    public DateOnly? EffectiveTo { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private EmployeeShiftAssignment() { }

    /// <summary>
    /// Creates a new EmployeeShiftAssignment instance.
    /// </summary>
    public static EmployeeShiftAssignment Create(
        int employeeId,
        int shiftId,
        DateOnly effectiveFrom,
        DateOnly? effectiveTo = null)
    {
        return new EmployeeShiftAssignment
        {
            EmployeeId = employeeId,
            ShiftId = shiftId,
            EffectiveFrom = effectiveFrom,
            EffectiveTo = effectiveTo,
            IsActive = true
        };
    }

    /// <summary>
    /// Deactivates or ends this shift assignment.
    /// </summary>
    public void EndAssignment(DateOnly effectiveTo)
    {
        EffectiveTo = effectiveTo;
        IsActive = false;
    }
}
