using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using Workora.Application.Common.Interfaces;

namespace Workora.Infrastructure.Storage;

/// <summary>
/// Implements file storage operations using Cloudinary API for documents, images, and raw media files.
/// </summary>
public class CloudinaryFileStorageService : IFileStorageService
{
    private readonly Cloudinary _cloudinary;
    private readonly CloudinarySettings _settings;

    /// <summary>
    /// Initializes a new instance of the <see cref="CloudinaryFileStorageService"/> class.
    /// </summary>
    /// <param name="options">The configured Cloudinary options.</param>
    public CloudinaryFileStorageService(IOptions<CloudinarySettings> options)
    {
        _settings = options.Value;
        var account = new Account(
            _settings.CloudName,
            _settings.ApiKey,
            _settings.ApiSecret);

        _cloudinary = new Cloudinary(account);
        _cloudinary.Api.Secure = true;
    }

    /// <summary>
    /// Uploads a file stream asynchronously to Cloudinary and returns the secure URL or public identifier.
    /// </summary>
    /// <param name="fileData">The binary file data stream.</param>
    /// <param name="fileName">The original filename including extension.</param>
    /// <param name="ct">Cancellation token for async operations.</param>
    /// <returns>The secure HTTPS URL of the uploaded file on Cloudinary.</returns>
    public async Task<string> UploadAsync(Stream fileData, string fileName, CancellationToken ct = default)
    {
        if (fileData == null || fileData.Length == 0)
        {
            throw new ArgumentException("File stream cannot be null or empty.", nameof(fileData));
        }

        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        var isImage = extension is ".jpg" or ".jpeg" or ".png" or ".gif" or ".webp" or ".bmp" or ".svg";

        if (isImage)
        {
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(fileName, fileData),
                Folder = _settings.Folder,
                PublicId = $"{Path.GetFileNameWithoutExtension(fileName)}_{Guid.NewGuid():N}",
                Overwrite = true
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            if (uploadResult.Error != null)
            {
                throw new InvalidOperationException($"Cloudinary upload failed: {uploadResult.Error.Message}");
            }

            return uploadResult.SecureUrl?.ToString() ?? uploadResult.Url?.ToString() ?? string.Empty;
        }
        else
        {
            var rawUploadParams = new RawUploadParams
            {
                File = new FileDescription(fileName, fileData),
                Folder = _settings.Folder,
                PublicId = $"{Path.GetFileNameWithoutExtension(fileName)}_{Guid.NewGuid():N}",
                Overwrite = true
            };

            var rawUploadResult = await _cloudinary.UploadAsync(rawUploadParams);
            if (rawUploadResult.Error != null)
            {
                throw new InvalidOperationException($"Cloudinary raw upload failed: {rawUploadResult.Error.Message}");
            }

            return rawUploadResult.SecureUrl?.ToString() ?? rawUploadResult.Url?.ToString() ?? string.Empty;
        }
    }

    /// <summary>
    /// Deletes a file resource asynchronously from Cloudinary by file URL or public ID.
    /// </summary>
    /// <param name="fileId">The secure URL or Cloudinary public ID of the resource.</param>
    /// <param name="ct">Cancellation token for async operations.</param>
    public async Task DeleteAsync(string fileId, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(fileId))
        {
            return;
        }

        var publicId = ExtractPublicIdFromUrl(fileId);
        var deleteParams = new DeletionParams(publicId);
        await _cloudinary.DestroyAsync(deleteParams);
    }

    /// <summary>
    /// Extracts the Cloudinary public identifier from a full secure Cloudinary resource URL.
    /// </summary>
    /// <param name="urlOrPublicId">The resource URL or public ID.</param>
    /// <returns>Clean public ID usable for deletion and management operations.</returns>
    private static string ExtractPublicIdFromUrl(string urlOrPublicId)
    {
        if (!urlOrPublicId.Contains("cloudinary.com"))
        {
            return urlOrPublicId;
        }

        try
        {
            var uri = new Uri(urlOrPublicId);
            var segments = uri.AbsolutePath.Split('/');
            var uploadIndex = Array.IndexOf(segments, "upload");
            if (uploadIndex >= 0 && uploadIndex + 2 < segments.Length)
            {
                var relativePath = string.Join("/", segments[(uploadIndex + 2)..]);
                var dotIndex = relativePath.LastIndexOf('.');
                return dotIndex > 0 ? relativePath[..dotIndex] : relativePath;
            }

            return Path.GetFileNameWithoutExtension(urlOrPublicId);
        }
        catch
        {
            return urlOrPublicId;
        }
    }
}
