namespace Workora.Application.Features.Payroll.DTOs;

/// <summary>
/// DTO representing bulk exported payslips archive package information.
/// </summary>
public class BulkPayslipsExportDto
{
    /// <summary>
    /// Gets or sets the payroll run ID.
    /// </summary>
    public int PayrollRunId { get; set; }

    /// <summary>
    /// Gets or sets the total number of payslips packaged.
    /// </summary>
    public int TotalPayslips { get; set; }

    /// <summary>
    /// Gets or sets the archive filename.
    /// </summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the downloadable URL or cloud storage path.
    /// </summary>
    public string DownloadUrl { get; set; } = string.Empty;
}
