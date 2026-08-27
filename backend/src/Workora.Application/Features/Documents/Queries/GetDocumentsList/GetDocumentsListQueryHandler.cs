using AutoMapper;
using MediatR;
using Workora.Application.Features.Documents.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Documents.Queries.GetDocumentsList;

/// <summary>
/// Handler for <see cref="GetDocumentsListQuery"/>.
/// </summary>
public class GetDocumentsListQueryHandler : IRequestHandler<GetDocumentsListQuery, ApiResponse<PagedResponse<DocumentDto>>>
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetDocumentsListQueryHandler"/> class.
    /// </summary>
    public GetDocumentsListQueryHandler(IDocumentRepository documentRepository, IMapper mapper)
    {
        _documentRepository = documentRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<PagedResponse<DocumentDto>>> Handle(GetDocumentsListQuery request, CancellationToken ct)
    {
        var docs = await _documentRepository.GetDocumentsPagedAsync(
            request.PageNumber,
            request.PageSize,
            request.CompanyId,
            request.EmployeeId,
            request.Category,
            request.SearchTerm,
            ct);

        var totalCount = await _documentRepository.GetDocumentsCountAsync(
            request.CompanyId,
            request.EmployeeId,
            request.Category,
            request.SearchTerm,
            ct);

        var dtos = _mapper.Map<IReadOnlyList<DocumentDto>>(docs);
        var paged = new PagedResponse<DocumentDto>(dtos, totalCount, request.PageNumber, request.PageSize);

        return ApiResponse<PagedResponse<DocumentDto>>.Success(paged);
    }
}
