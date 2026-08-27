using MediatR;
using Workora.Application.Features.Documents.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Documents.Queries.DownloadDocument;

/// <summary>
/// Query to generate a secure document download link.
/// </summary>
public record DownloadDocumentQuery(int DocumentId) : IRequest<ApiResponse<DocumentDownloadDto>>;
