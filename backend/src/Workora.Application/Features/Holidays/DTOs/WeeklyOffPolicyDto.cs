namespace Workora.Application.Features.Holidays.DTOs;

/// <summary>
/// DTO representing company weekly-off policy details.
/// </summary>
public class WeeklyOffPolicyDto
{
    /// <summary>
    /// Gets or sets company identifier.
    /// </summary>
    public int CompanyId { get; set; }

    /// <summary>
    /// Gets or sets comma-separated weekly off days (e.g., "Saturday,Sunday").
    /// </summary>
    public string WeeklyOffDays { get; set; } = "Sunday";

    /// <summary>
    /// Gets or sets a value indicating whether alternate Saturdays are designated off.
    /// </summary>
    public bool AlternateSaturdayOff { get; set; }
}
