namespace Workora.Application.Features.Documents.DTOs;

/// <summary>
/// DTO representing a secure document download link response.
/// </summary>
public class DocumentDownloadDto
{
    /// <summary>
    /// Gets or sets document ID.
    /// </summary>
    public int DocumentId { get; set; }

    /// <summary>
    /// Gets or sets original filename.
    /// </summary>
    public string FileName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets content MIME type.
    /// </summary>
    public string ContentType { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets signed secure storage URL.
    /// </summary>
    public string DownloadUrl { get; set; } = string.Empty;
}
