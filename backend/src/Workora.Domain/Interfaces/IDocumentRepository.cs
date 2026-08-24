using Workora.Domain.Entities;
using Workora.Domain.Enums;

namespace Workora.Domain.Interfaces;

/// <summary>
/// Repository interface for document upload and retrieval.
/// </summary>
public interface IDocumentRepository : IRepository<Document>
{
    /// <summary>
    /// Gets a paginated list of documents.
    /// </summary>
    Task<IReadOnlyList<Document>> GetDocumentsPagedAsync(int pageNumber, int pageSize, int? companyId = null, int? employeeId = null, DocumentCategory? category = null, string? searchTerm = null, CancellationToken ct = default);

    /// <summary>
    /// Gets total count of documents.
    /// </summary>
    Task<int> GetDocumentsCountAsync(int? companyId = null, int? employeeId = null, DocumentCategory? category = null, string? searchTerm = null, CancellationToken ct = default);
}
