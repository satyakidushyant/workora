namespace Workora.Application.Features.Policies.DTOs;

/// <summary>
/// DTO representing policy compliance acknowledgment audit stats.
/// </summary>
public class PolicyComplianceAuditDto
{
    /// <summary>
    /// Gets or sets policy ID.
    /// </summary>
    public int PolicyId { get; set; }

    /// <summary>
    /// Gets or sets policy title.
    /// </summary>
    public string PolicyTitle { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets total required employees.
    /// </summary>
    public int TotalEmployees { get; set; }

    /// <summary>
    /// Gets or sets count of acknowledged employees.
    /// </summary>
    public int AcknowledgedCount { get; set; }

    /// <summary>
    /// Gets or sets compliance percentage (0 to 100).
    /// </summary>
    public decimal CompliancePercentage { get; set; }
}
