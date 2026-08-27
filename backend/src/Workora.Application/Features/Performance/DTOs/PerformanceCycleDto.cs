namespace Workora.Application.Features.Performance.DTOs;

/// <summary>
/// DTO representing an appraisal performance review cycle.
/// </summary>
public class PerformanceCycleDto
{
    /// <summary>
    /// Gets or sets cycle identifier.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets company ID.
    /// </summary>
    public int CompanyId { get; set; }

    /// <summary>
    /// Gets or sets cycle title / period (e.g. "Annual Review 2026", "H1 KPI Appraisal").
    /// </summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets cycle year.
    /// </summary>
    public int Year { get; set; }

    /// <summary>
    /// Gets or sets active status flag.
    /// </summary>
    public bool IsActive { get; set; }
}
