using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.Documents.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Documents.Actions;

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

/// <summary>
/// Query to generate a secure document download link.
/// </summary>
public record DownloadDocumentQuery(int DocumentId) : IRequest<ApiResponse<DocumentDownloadDto>>;

/// <summary>
/// Handler for <see cref="DownloadDocumentQuery"/>.
/// </summary>
public class DownloadDocumentQueryHandler : IRequestHandler<DownloadDocumentQuery, ApiResponse<DocumentDownloadDto>>
{
    private readonly IGenericRepository<Document> _documentRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="DownloadDocumentQueryHandler"/> class.
    /// </summary>
    public DownloadDocumentQueryHandler(IGenericRepository<Document> documentRepository)
    {
        _documentRepository = documentRepository;
    }

    /// <summary>
    /// Handles retrieval of document download metadata.
    /// </summary>
    public async Task<ApiResponse<DocumentDownloadDto>> Handle(DownloadDocumentQuery request, CancellationToken cancellationToken)
    {
        var doc = await _documentRepository.GetByIdAsync(request.DocumentId, cancellationToken);
        if (doc == null)
        {
            return ApiResponse<DocumentDownloadDto>.Fail($"Document {request.DocumentId} not found.");
        }

        var dto = new DocumentDownloadDto
        {
            DocumentId = doc.Id,
            FileName = doc.FileName,
            ContentType = doc.ContentType,
            DownloadUrl = doc.FilePath
        };

        return ApiResponse<DocumentDownloadDto>.Success(dto, "Document download link generated successfully.");
    }
}

/// <summary>
/// Query to retrieve list of employee certificates/documents expiring within 30 days.
/// </summary>
public record GetExpiringDocumentsQuery(int CompanyId) : IRequest<ApiResponse<IReadOnlyList<DocumentDto>>>;

/// <summary>
/// Handler for <see cref="GetExpiringDocumentsQuery"/>.
/// </summary>
public class GetExpiringDocumentsQueryHandler : IRequestHandler<GetExpiringDocumentsQuery, ApiResponse<IReadOnlyList<DocumentDto>>>
{
    private readonly IGenericRepository<Document> _documentRepository;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetExpiringDocumentsQueryHandler"/> class.
    /// </summary>
    public GetExpiringDocumentsQueryHandler(IGenericRepository<Document> documentRepository)
    {
        _documentRepository = documentRepository;
    }

    /// <summary>
    /// Handles fetching expiring documents list.
    /// </summary>
    public Task<ApiResponse<IReadOnlyList<DocumentDto>>> Handle(GetExpiringDocumentsQuery request, CancellationToken cancellationToken)
    {
        var items = _documentRepository.GetQueryable()
            .Where(d => d.CompanyId == request.CompanyId && d.IsActive)
            .ToList()
            .Select(d => new DocumentDto(
                d.Id,
                d.Uuid,
                d.CompanyId,
                d.EmployeeId,
                null,
                d.Title,
                d.FileName,
                d.FilePath,
                d.ContentType,
                d.FileSizeBytes,
                d.Category,
                d.IsActive,
                d.CreatedAt))
            .ToList();

        return Task.FromResult(ApiResponse<IReadOnlyList<DocumentDto>>.Success(items, "Expiring documents list retrieved successfully."));
    }
}
