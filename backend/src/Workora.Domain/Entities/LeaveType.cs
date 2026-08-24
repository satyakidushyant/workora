using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a category/type of leave (e.g. Annual Leave, Sick Leave, Unpaid Leave).
/// </summary>
public class LeaveType : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the parent company.
    /// </summary>
    public int CompanyId { get; private set; }

    /// <summary>
    /// Display name of the leave type.
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// Unique code for the leave type (e.g. "AL", "SL", "ML", "UL").
    /// </summary>
    public string Code { get; private set; } = null!;

    /// <summary>
    /// Annual default allocation quota in days.
    /// </summary>
    public decimal AnnualQuota { get; private set; }

    /// <summary>
    /// Indicates whether secondary HR approval is required after manager approval.
    /// </summary>
    public bool RequiresHrApproval { get; private set; }

    /// <summary>
    /// Indicates whether leave requests can exceed available balance (e.g. for unpaid leave).
    /// </summary>
    public bool AllowNegativeBalance { get; private set; }

    /// <summary>
    /// Brief description of the leave type policy.
    /// </summary>
    public string? Description { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private LeaveType() { }

    /// <summary>
    /// Creates a new LeaveType instance.
    /// </summary>
    public static LeaveType Create(
        int companyId,
        string name,
        string code,
        decimal annualQuota,
        bool requiresHrApproval = false,
        bool allowNegativeBalance = false,
        string? description = null)
    {
        return new LeaveType
        {
            CompanyId = companyId,
            Name = name,
            Code = code.ToUpperInvariant(),
            AnnualQuota = annualQuota,
            RequiresHrApproval = requiresHrApproval,
            AllowNegativeBalance = allowNegativeBalance,
            Description = description,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates the leave type definition.
    /// </summary>
    public void Update(
        string name,
        string code,
        decimal annualQuota,
        bool requiresHrApproval,
        bool allowNegativeBalance,
        string? description)
    {
        Name = name;
        Code = code.ToUpperInvariant();
        AnnualQuota = annualQuota;
        RequiresHrApproval = requiresHrApproval;
        AllowNegativeBalance = allowNegativeBalance;
        Description = description;
    }
}
