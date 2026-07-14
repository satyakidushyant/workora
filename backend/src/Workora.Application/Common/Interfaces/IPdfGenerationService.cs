namespace Workora.Application.Common.Interfaces;

/// <summary>
/// Defines the contract for generating PDF documents.
/// </summary>
public interface IPdfGenerationService
{
    /// <summary>
    /// Generates a PDF asynchronously based on a template and data model.
    /// </summary>
    /// <typeparam name="T">The type of the data model.</typeparam>
    /// <param name="templateName">The name of the template to use.</param>
    /// <param name="model">The data model.</param>
    /// <param name="ct">The cancellation token.</param>
    /// <returns>A task that represents the asynchronous operation, returning the PDF file as a byte array.</returns>
    Task<byte[]> GeneratePdfAsync<T>(string templateName, T model, CancellationToken ct = default);
}
