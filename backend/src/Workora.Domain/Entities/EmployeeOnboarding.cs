using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Tracks the onboarding status of an employee against a specific checklist item.
/// </summary>
public class EmployeeOnboarding : AuditableEntity
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
    /// Foreign key identifier for the onboarding checklist item.
    /// </summary>
    public int ChecklistId { get; private set; }

    /// <summary>
    /// Navigation property to the checklist item.
    /// </summary>
    public OnboardingChecklist Checklist { get; private set; } = null!;

    /// <summary>
    /// Whether this item has been completed/verified.
    /// </summary>
    public bool IsCompleted { get; private set; } = false;

    /// <summary>
    /// Foreign key of the employee who verified this item.
    /// </summary>
    public int? VerifiedByEmployeeId { get; private set; }

    /// <summary>
    /// Navigation property to the verifier employee.
    /// </summary>
    public Employee? VerifiedByEmployee { get; private set; }

    /// <summary>
    /// Timestamp when the item was verified.
    /// </summary>
    public DateTimeOffset? VerifiedAt { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private EmployeeOnboarding() { }

    /// <summary>
    /// Creates a new EmployeeOnboarding instance.
    /// </summary>
    public static EmployeeOnboarding Create(int employeeId, int checklistId)
    {
        return new EmployeeOnboarding
        {
            EmployeeId = employeeId,
            ChecklistId = checklistId,
            IsCompleted = false,
            IsActive = true
        };
    }

    /// <summary>
    /// Marks this onboarding item as verified/completed.
    /// </summary>
    public void Verify(int verifierEmployeeId)
    {
        IsCompleted = true;
        VerifiedByEmployeeId = verifierEmployeeId;
        VerifiedAt = DateTimeOffset.UtcNow;
    }

    /// <summary>
    /// Unmarks the verification.
    /// </summary>
    public void Unverify()
    {
        IsCompleted = false;
        VerifiedByEmployeeId = null;
        VerifiedAt = null;
    }
}