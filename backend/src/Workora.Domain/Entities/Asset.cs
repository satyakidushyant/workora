using Workora.Domain.Common;
using Workora.Domain.Enums;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a company asset / physical hardware item.
/// </summary>
public class Asset : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the parent company.
    /// </summary>
    public int CompanyId { get; private set; }

    /// <summary>
    /// Display name / model of the asset.
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// Unique internal asset inventory tag.
    /// </summary>
    public string AssetTag { get; private set; } = null!;

    /// <summary>
    /// Manufacturer serial number.
    /// </summary>
    public string? SerialNumber { get; private set; }

    /// <summary>
    /// Category classification (e.g., "Laptop", "Mobile Device", "Vehicle", "Monitor").
    /// </summary>
    public string Category { get; private set; } = null!;

    /// <summary>
    /// Current asset status.
    /// </summary>
    public AssetStatus Status { get; private set; } = AssetStatus.Available;

    /// <summary>
    /// Purchase price.
    /// </summary>
    public decimal? PurchaseCost { get; private set; }

    /// <summary>
    /// Date acquired.
    /// </summary>
    public DateOnly? PurchaseDate { get; private set; }

    private readonly List<AssetAssignment> _assignments = new();
    /// <summary>
    /// Historical assignment records.
    /// </summary>
    public IReadOnlyCollection<AssetAssignment> Assignments => _assignments.AsReadOnly();

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Asset() { }

    /// <summary>
    /// Creates a new Asset inventory item.
    /// </summary>
    public static Asset Create(
        int companyId,
        string name,
        string assetTag,
        string category,
        string? serialNumber = null,
        decimal? purchaseCost = null,
        DateOnly? purchaseDate = null)
    {
        return new Asset
        {
            CompanyId = companyId,
            Name = name,
            AssetTag = assetTag.ToUpperInvariant(),
            Category = category,
            SerialNumber = serialNumber,
            PurchaseCost = purchaseCost,
            PurchaseDate = purchaseDate,
            Status = AssetStatus.Available,
            IsActive = true
        };
    }

    /// <summary>
    /// Assigns the asset to an employee.
    /// </summary>
    public void Assign()
    {
        Status = AssetStatus.Assigned;
    }

    /// <summary>
    /// Returns the asset back to available inventory.
    /// </summary>
    public void Return()
    {
        Status = AssetStatus.Available;
    }
}

/// <summary>
/// Represents the checkout assignment of an asset to an employee.
/// </summary>
public class AssetAssignment : BaseEntity
{
    /// <summary>
    /// Foreign key identifier for the asset.
    /// </summary>
    public int AssetId { get; private set; }

    /// <summary>
    /// Navigation property to the asset.
    /// </summary>
    public Asset Asset { get; private set; } = null!;

    /// <summary>
    /// Foreign key identifier for the employee.
    /// </summary>
    public int EmployeeId { get; private set; }

    /// <summary>
    /// Navigation property to the employee.
    /// </summary>
    public Employee Employee { get; private set; } = null!;

    /// <summary>
    /// The date the asset was assigned.
    /// </summary>
    public DateOnly AssignedDate { get; private set; }

    /// <summary>
    /// The date the asset was returned.
    /// </summary>
    public DateOnly? ReturnedDate { get; private set; }

    /// <summary>
    /// Condition remarks upon return.
    /// </summary>
    public string? ReturnCondition { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private AssetAssignment() { }

    /// <summary>
    /// Creates a new AssetAssignment record.
    /// </summary>
    public static AssetAssignment Create(int assetId, int employeeId, DateOnly assignedDate)
    {
        return new AssetAssignment
        {
            AssetId = assetId,
            EmployeeId = employeeId,
            AssignedDate = assignedDate,
            IsActive = true
        };
    }

    /// <summary>
    /// Marks the asset assignment as returned.
    /// </summary>
    public void MarkReturned(DateOnly returnedDate, string? condition = null)
    {
        ReturnedDate = returnedDate;
        ReturnCondition = condition;
        IsActive = false;
    }
}
