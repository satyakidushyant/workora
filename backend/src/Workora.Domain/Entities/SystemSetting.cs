using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a company-level key-value system configuration parameter.
/// </summary>
public class SystemSetting : BaseEntity
{
    /// <summary>
    /// Foreign key identifier for the parent company.
    /// </summary>
    public int CompanyId { get; private set; }

    /// <summary>
    /// Configuration key identifier (e.g., "Timezone", "Currency", "FiscalYearStart").
    /// </summary>
    public string Key { get; private set; } = null!;

    /// <summary>
    /// Serialized setting value.
    /// </summary>
    public string Value { get; private set; } = null!;

    /// <summary>
    /// Description of the configuration parameter.
    /// </summary>
    public string? Description { get; private set; }

    /// <summary>
    /// Group category (e.g., "General", "Payroll", "Attendance", "Email").
    /// </summary>
    public string Group { get; private set; } = "General";

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private SystemSetting() { }

    /// <summary>
    /// Creates a new SystemSetting instance.
    /// </summary>
    public static SystemSetting Create(
        int companyId,
        string key,
        string value,
        string? description = null,
        string group = "General")
    {
        return new SystemSetting
        {
            CompanyId = companyId,
            Key = key,
            Value = value,
            Description = description,
            Group = group,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates the setting value.
    /// </summary>
    public void UpdateValue(string value)
    {
        Value = value;
    }
}
