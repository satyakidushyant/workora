using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Documents.Commands.DeleteDocument;

/// <summary>
/// Command to soft-delete a document record.
/// </summary>
public record DeleteDocumentCommand(int Id) : IRequest<ApiResponse<bool>>;

/// <summary>
/// Handler for <see cref="DeleteDocumentCommand"/>.
/// </summary>
public class DeleteDocumentCommandHandler : IRequestHandler<DeleteDocumentCommand, ApiResponse<bool>>
{
    private readonly IDocumentRepository _documentRepository;
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="DeleteDocumentCommandHandler"/> class.
    /// </summary>
    public DeleteDocumentCommandHandler(IDocumentRepository documentRepository, IUnitOfWork unitOfWork)
    {
        _documentRepository = documentRepository;
        _unitOfWork = unitOfWork;
    }

    /// <inheritdoc />
    public async Task<ApiResponse<bool>> Handle(DeleteDocumentCommand request, CancellationToken ct)
    {
        var doc = await _documentRepository.GetByIdAsync(request.Id, ct);
        if (doc == null)
        {
            return ApiResponse<bool>.Fail(ResponseMessage.DocumentNotFound.GetDescription());
        }

        _documentRepository.Remove(doc);
        await _unitOfWork.SaveChangesAsync(ct);

        return ApiResponse<bool>.Success(true, ResponseMessage.DocumentDeleted.GetDescription());
    }
}
