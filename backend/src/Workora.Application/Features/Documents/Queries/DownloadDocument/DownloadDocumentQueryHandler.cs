using MediatR;
using Workora.Application.Features.Documents.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Documents.Queries.DownloadDocument;

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
