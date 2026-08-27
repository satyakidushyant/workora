namespace Workora.Application.Features.Recruitment.DTOs;

/// <summary>
/// DTO representing offer letter PDF download metadata.
/// </summary>
public class OfferLetterPdfDto
{
    /// <summary>
    /// Gets or sets offer ID.
    /// </summary>
    public int OfferId { get; set; }

    /// <summary>
    /// Gets or sets document file title.
    /// </summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets secure download URL.
    /// </summary>
    public string DownloadUrl { get; set; } = string.Empty;
}
