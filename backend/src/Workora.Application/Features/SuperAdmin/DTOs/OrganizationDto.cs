namespace Workora.Application.Features.SuperAdmin.DTOs;

/// <summary>
/// Data Transfer Object representing a tenant organization / company for SuperAdmin operations.
/// </summary>
public class OrganizationDto
{
    /// <summary>
    /// Gets or sets the company identifier.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the official company name.
    /// </summary>
    public string Name { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the corporate code.
    /// </summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the registration number.
    /// </summary>
    public string? RegistrationNumber { get; set; }

    /// <summary>
    /// Gets or sets the tax identifier.
    /// </summary>
    public string? TaxId { get; set; }

    /// <summary>
    /// Gets or sets corporate primary email.
    /// </summary>
    public string? Email { get; set; }

    /// <summary>
    /// Gets or sets primary phone number.
    /// </summary>
    public string? Phone { get; set; }

    /// <summary>
    /// Gets or sets company website.
    /// </summary>
    public string? Website { get; set; }

    /// <summary>
    /// Gets or sets company logo URL.
    /// </summary>
    public string? LogoUrl { get; set; }

    /// <summary>
    /// Gets or sets the primary registered address.
    /// </summary>
    public string? Address { get; set; }

    /// <summary>
    /// Gets or sets the fiscal year start month (e.g., 4 for April).
    /// </summary>
    public int FiscalYearStartMonth { get; set; } = 4;

    /// <summary>
    /// Gets or sets the total number of branches under this organization.
    /// </summary>
    public int BranchCount { get; set; }

    /// <summary>
    /// Gets or sets the total active employees count in this organization.
    /// </summary>
    public int EmployeeCount { get; set; }

    /// <summary>
    /// Gets or sets the assigned SaaS subscription plan name.
    /// </summary>
    public string SubscriptionPlan { get; set; } = "Growth";

    /// <summary>
    /// Gets or sets the industry or business sector.
    /// </summary>
    public string? Industry { get; set; }

    /// <summary>
    /// Gets or sets the primary contact person's name.
    /// </summary>
    public string? PrimaryContactName { get; set; }

    /// <summary>
    /// Gets or sets base currency.
    /// </summary>
    public string Currency { get; set; } = "INR";

    /// <summary>
    /// Gets or sets active status flag.
    /// </summary>
    public bool IsActive { get; set; }

    /// <summary>
    /// Gets or sets creation timestamp.
    /// </summary>
    public DateTimeOffset CreatedAt { get; set; }
}
