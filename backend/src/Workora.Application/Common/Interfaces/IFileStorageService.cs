namespace Workora.Application.Common.Interfaces;

/// <summary>
/// Defines the contract for a file storage service.
/// </summary>
public interface IFileStorageService
{
    /// <summary>
    /// Uploads a file asynchronously.
    /// </summary>
    /// <param name="fileData">The file data stream.</param>
    /// <param name="fileName">The original name of the file.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>A task that represents the asynchronous operation, returning the generated file URI or identifier.</returns>
    Task<string> UploadAsync(Stream fileData, string fileName, CancellationToken ct = default);

    /// <summary>
    /// Deletes a file asynchronously.
    /// </summary>
    /// <param name="fileId">The URI or identifier of the file to delete.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    Task DeleteAsync(string fileId, CancellationToken ct = default);
}
