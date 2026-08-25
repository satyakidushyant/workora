namespace Workora.Application.Features.SuperAdmin.DTOs;

/// <summary>
/// Data Transfer Object representing platform-wide global metrics for SuperAdmin dashboard.
/// </summary>
public class SuperAdminMetricsDto
{
    /// <summary>
    /// Gets or sets total count of registered tenant organizations.
    /// </summary>
    public int TotalOrganizations { get; set; }

    /// <summary>
    /// Gets or sets count of active organizations.
    /// </summary>
    public int ActiveOrganizations { get; set; }

    /// <summary>
    /// Gets or sets count of suspended organizations.
    /// </summary>
    public int SuspendedOrganizations { get; set; }

    /// <summary>
    /// Gets or sets total system user accounts across all tenants.
    /// </summary>
    public int TotalSystemUsers { get; set; }

    /// <summary>
    /// Gets or sets total active employee records platform wide.
    /// </summary>
    public int TotalEmployees { get; set; }

    /// <summary>
    /// Gets or sets count of subscription plans offered.
    /// </summary>
    public int ActiveSubscriptionPlans { get; set; }
}
