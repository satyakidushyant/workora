namespace Workora.Application.Features.Reports.DTOs;

/// <summary>
/// DTO representing employee attrition & turnover metrics.
/// </summary>
public class AttritionReportDto
{
    /// <summary>
    /// Gets or sets total headcount at start of period.
    /// </summary>
    public int OpeningHeadcount { get; set; }

    /// <summary>
    /// Gets or sets total hires during period.
    /// </summary>
    public int NewHires { get; set; }

    /// <summary>
    /// Gets or sets total exits/terminations during period.
    /// </summary>
    public int TotalExits { get; set; }

    /// <summary>
    /// Gets or sets closing headcount.
    /// </summary>
    public int ClosingHeadcount { get; set; }

    /// <summary>
    /// Gets or sets calculated attrition rate percentage.
    /// </summary>
    public decimal AttritionRatePercentage { get; set; }
}
