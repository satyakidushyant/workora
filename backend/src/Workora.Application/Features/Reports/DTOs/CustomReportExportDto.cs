namespace Workora.Application.Features.Reports.DTOs;

/// <summary>
/// DTO representing custom dynamic report export response.
/// </summary>
public class CustomReportExportDto
{
    /// <summary>
    /// Gets or sets export filename.
    /// </summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets export MIME content type.
    /// </summary>
    public string ContentType { get; set; } = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    /// <summary>
    /// Gets or sets secure download URL.
    /// </summary>
    public string DownloadUrl { get; set; } = string.Empty;
}
