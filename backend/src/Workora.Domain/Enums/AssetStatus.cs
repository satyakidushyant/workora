namespace Workora.Domain.Enums;

/// <summary>
/// Inventory and assignment status of a corporate asset.
/// </summary>
public enum AssetStatus
{
    /// <summary>
    /// Available in storage for assignment.
    /// </summary>
    Available = 1,

    /// <summary>
    /// Assigned to an employee.
    /// </summary>
    Assigned = 2,

    /// <summary>
    /// Under maintenance or repair.
    /// </summary>
    InRepair = 3,

    /// <summary>
    /// Retired or disposed of.
    /// </summary>
    Retired = 4
}
