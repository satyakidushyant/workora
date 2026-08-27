namespace Workora.Application.Features.Payroll.DTOs;

/// <summary>
/// DTO representing bank disbursement payment file payload.
/// </summary>
public class PayrollDisbursementFileDto
{
    /// <summary>
    /// Gets or sets payroll run ID.
    /// </summary>
    public int PayrollRunId { get; set; }

    /// <summary>
    /// Gets or sets total net salary disbursement amount.
    /// </summary>
    public decimal TotalAmount { get; set; }

    /// <summary>
    /// Gets or sets generated bank CSV/txt file content or download URL.
    /// </summary>
    public string DownloadUrl { get; set; } = string.Empty;
}
