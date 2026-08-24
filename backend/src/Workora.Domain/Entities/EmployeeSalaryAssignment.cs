using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Maps an employee to their assigned salary structure and base pay rate.
/// </summary>
public class EmployeeSalaryAssignment : AuditableEntity
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
    /// Foreign key identifier for the assigned salary structure.
    /// </summary>
    public int SalaryStructureId { get; private set; }

    /// <summary>
    /// Navigation property to the salary structure.
    /// </summary>
    public SalaryStructure SalaryStructure { get; private set; } = null!;

    /// <summary>
    /// Base / monthly reference salary.
    /// </summary>
    public decimal BaseSalary { get; private set; }

    /// <summary>
    /// Effective starting date of this salary compensation plan.
    /// </summary>
    public DateOnly EffectiveFrom { get; private set; }

    /// <summary>
    /// Effective end date of this compensation plan, if superseded.
    /// </summary>
    public DateOnly? EffectiveTo { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private EmployeeSalaryAssignment() { }

    /// <summary>
    /// Creates a new EmployeeSalaryAssignment instance.
    /// </summary>
    public static EmployeeSalaryAssignment Create(
        int employeeId,
        int salaryStructureId,
        decimal baseSalary,
        DateOnly effectiveFrom,
        DateOnly? effectiveTo = null)
    {
        return new EmployeeSalaryAssignment
        {
            EmployeeId = employeeId,
            SalaryStructureId = salaryStructureId,
            BaseSalary = baseSalary,
            EffectiveFrom = effectiveFrom,
            EffectiveTo = effectiveTo,
            IsActive = true
        };
    }

    /// <summary>
    /// Terminates / supersedes this compensation assignment.
    /// </summary>
    public void EndAssignment(DateOnly effectiveTo)
    {
        EffectiveTo = effectiveTo;
        IsActive = false;
    }
}
