using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a physical branch or office location under a company.
/// </summary>
public class Branch : AuditableEntity
{
    /// <summary>
    /// Foreign key identifier for the parent company.
    /// </summary>
    public int CompanyId { get; private set; }

    /// <summary>
    /// The parent company navigation property.
    /// </summary>
    public Company Company { get; private set; } = null!;

    /// <summary>
    /// The name of the branch.
    /// </summary>
    public string Name { get; private set; } = null!;

    /// <summary>
    /// The unique branch code within the company.
    /// </summary>
    public string Code { get; private set; } = null!;

    /// <summary>
    /// The city or geographical location.
    /// </summary>
    public string Location { get; private set; } = null!;

    /// <summary>
    /// The physical address of the branch.
    /// </summary>
    public string? Address { get; private set; }

    /// <summary>
    /// The IANA timezone identifier (e.g. "UTC", "America/New_York", "Asia/Kolkata").
    /// </summary>
    public string Timezone { get; private set; } = "UTC";

    /// <summary>
    /// Indicates whether this branch serves as the company's head office.
    /// </summary>
    public bool IsHeadOffice { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private Branch() { }

    /// <summary>
    /// Creates a new Branch instance.
    /// </summary>
    public static Branch Create(
        int companyId,
        string name,
        string code,
        string location,
        string? address = null,
        string timezone = "UTC",
        bool isHeadOffice = false)
    {
        return new Branch
        {
            CompanyId = companyId,
            Name = name,
            Code = code.ToUpperInvariant(),
            Location = location,
            Address = address,
            Timezone = string.IsNullOrWhiteSpace(timezone) ? "UTC" : timezone,
            IsHeadOffice = isHeadOffice,
            IsActive = true
        };
    }

    /// <summary>
    /// Updates the branch details.
    /// </summary>
    public void Update(
        string name,
        string code,
        string location,
        string? address,
        string timezone,
        bool isHeadOffice)
    {
        Name = name;
        Code = code.ToUpperInvariant();
        Location = location;
        Address = address;
        Timezone = string.IsNullOrWhiteSpace(timezone) ? "UTC" : timezone;
        IsHeadOffice = isHeadOffice;
    }
}
