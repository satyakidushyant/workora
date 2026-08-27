using AutoMapper;
using MediatR;
using Workora.Application.Features.Documents.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Documents.Queries.GetDocumentById;

/// <summary>
/// Handler for <see cref="GetDocumentByIdQuery"/>.
/// </summary>
public class GetDocumentByIdQueryHandler : IRequestHandler<GetDocumentByIdQuery, ApiResponse<DocumentDto>>
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IMapper _mapper;

    /// <summary>
    /// Initializes a new instance of the <see cref="GetDocumentByIdQueryHandler"/> class.
    /// </summary>
    public GetDocumentByIdQueryHandler(IDocumentRepository documentRepository, IMapper mapper)
    {
        _documentRepository = documentRepository;
        _mapper = mapper;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<DocumentDto>> Handle(GetDocumentByIdQuery request, CancellationToken ct)
    {
        var doc = await _documentRepository.GetByIdAsync(request.Id, ct);
        if (doc == null)
        {
            return ApiResponse<DocumentDto>.Fail("Document not found.");
        }

        var dto = _mapper.Map<DocumentDto>(doc);
        return ApiResponse<DocumentDto>.Success(dto);
    }
}
