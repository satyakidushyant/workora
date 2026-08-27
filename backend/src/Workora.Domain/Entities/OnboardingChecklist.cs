using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a company-wide onboarding checklist template item.
/// </summary>
public class OnboardingChecklist : AuditableEntity
{
    /// <summary>
    /// The task name (e.g., "ID Card Issuance", "Laptop Setup").
    /// </summary>
    public string TaskName { get; private set; } = null!;

    /// <summary>
    /// The role responsible for completing this item (IT, HR, Admin).
    /// </summary>
    public string AssignedRole { get; private set; } = null!;

    /// <summary>
    /// Whether this checklist item is mandatory.
    /// </summary>
    public bool IsMandatory { get; private set; } = true;

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private OnboardingChecklist() { }

    /// <summary>
    /// Creates a new OnboardingChecklist instance.
    /// </summary>
    public static OnboardingChecklist Create(string taskName, string assignedRole, bool isMandatory = true)
    {
        return new OnboardingChecklist
        {
            TaskName = taskName,
            AssignedRole = assignedRole,
            IsMandatory = isMandatory,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates the checklist item details.
    /// </summary>
    public void Update(string taskName, string assignedRole, bool isMandatory)
    {
        TaskName = taskName;
        AssignedRole = assignedRole;
        IsMandatory = isMandatory;
    }
}