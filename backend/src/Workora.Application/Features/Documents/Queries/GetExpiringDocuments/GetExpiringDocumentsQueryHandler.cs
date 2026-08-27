using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Application.Features.Documents.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Documents.Queries.GetExpiringDocuments;

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

        return Task.FromResult(ApiResponse<IReadOnlyList<DocumentDto>>.Success(items, ResponseMessage.ExpiringDocumentsRetrieved.GetDescription()));
    }
}
