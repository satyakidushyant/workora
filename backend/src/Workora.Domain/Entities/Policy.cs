using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents an organizational policy, handbook, or standard operating procedure.
/// </summary>
public class Policy : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the parent company.
    /// </summary>
    public int CompanyId { get; private set; }

    /// <summary>
    /// Title of the policy document.
    /// </summary>
    public string Title { get; private set; } = null!;

    /// <summary>
    /// Full policy markdown or formatted content.
    /// </summary>
    public string Content { get; private set; } = null!;

    /// <summary>
    /// Policy version (e.g. "1.0", "2.1").
    /// </summary>
    public string Version { get; private set; } = "1.0";

    /// <summary>
    /// Effective starting date.
    /// </summary>
    public DateOnly EffectiveDate { get; private set; }

    /// <summary>
    /// Indicates whether employees must acknowledge having read this policy.
    /// </summary>
    public bool RequiresAcknowledgment { get; private set; }

    private readonly List<PolicyAcknowledgment> _acknowledgments = new();
    /// <summary>
    /// Collection of employee acknowledgments.
    /// </summary>
    public IReadOnlyCollection<PolicyAcknowledgment> Acknowledgments => _acknowledgments.AsReadOnly();

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Policy() { }

    /// <summary>
    /// Creates a new Policy instance.
    /// </summary>
    public static Policy Create(
        int companyId,
        string title,
        string content,
        string version,
        DateOnly effectiveDate,
        bool requiresAcknowledgment = true)
    {
        return new Policy
        {
            CompanyId = companyId,
            Title = title,
            Content = content,
            Version = version,
            EffectiveDate = effectiveDate,
            RequiresAcknowledgment = requiresAcknowledgment,
            IsActive = true
        };
    }
}

/// <summary>
/// Audit record of an employee acknowledging a corporate policy.
/// </summary>
public class PolicyAcknowledgment : BaseEntity
{
    /// <summary>
    /// Foreign key identifier for the policy.
    /// </summary>
    public int PolicyId { get; private set; }

    /// <summary>
    /// Navigation property to the policy.
    /// </summary>
    public Policy Policy { get; private set; } = null!;

    /// <summary>
    /// Foreign key identifier for the acknowledging employee.
    /// </summary>
    public int EmployeeId { get; private set; }

    /// <summary>
    /// Navigation property to the employee.
    /// </summary>
    public Employee Employee { get; private set; } = null!;

    /// <summary>
    /// Timestamp when acknowledgment was recorded.
    /// </summary>
    public DateTimeOffset AcknowledgedAt { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private PolicyAcknowledgment() { }

    /// <summary>
    /// Creates a new PolicyAcknowledgment record.
    /// </summary>
    public static PolicyAcknowledgment Create(int policyId, int employeeId)
    {
        return new PolicyAcknowledgment
        {
            PolicyId = policyId,
            EmployeeId = employeeId,
            AcknowledgedAt = DateTimeOffset.UtcNow,
            IsActive = true
        };
    }
}
