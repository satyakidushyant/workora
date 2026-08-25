namespace Workora.Infrastructure.Storage;

/// <summary>
/// Holds configuration settings for Cloudinary file storage service.
/// </summary>
public class CloudinarySettings
{
    /// <summary>
    /// Configuration key for appsettings section.
    /// </summary>
    public const string SectionName = "CloudinarySettings";

    /// <summary>
    /// Gets or sets the Cloudinary Cloud Name.
    /// </summary>
    public string CloudName { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the Cloudinary API Key.
    /// </summary>
    public string ApiKey { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the Cloudinary API Secret.
    /// </summary>
    public string ApiSecret { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the default folder name for storing uploaded files in Cloudinary.
    /// </summary>
    public string Folder { get; set; } = "workora_uploads";
}
