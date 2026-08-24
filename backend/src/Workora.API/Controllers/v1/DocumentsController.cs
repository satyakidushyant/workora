using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Workora.Application.Features.Documents.Commands.CreateDocument;
using Workora.Application.Features.Documents.Commands.DeleteDocument;
using Workora.Application.Features.Documents.DTOs;
using Workora.Application.Features.Documents.Queries.GetDocumentById;
using Workora.Application.Features.Documents.Queries.GetDocumentsList;
using Workora.Shared.Responses;

namespace Workora.API.Controllers.v1;

/// <summary>
/// Controller for corporate policies, employee attachments, certificates, and compliance documents.
/// </summary>
[ApiController]
[Route("api/v1/documents")]
public class DocumentsController : ControllerBase
{
    private readonly IMediator _mediator;

    /// <summary>
    /// Initializes a new instance of the <see cref="DocumentsController"/> class.
    /// </summary>
    /// <param name="mediator">The mediator instance.</param>
    public DocumentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Gets a paginated list of organizational and employee documents.
    /// </summary>
    /// <param name="query">Filter criteria.</param>
    /// <returns>A paginated list of documents.</returns>
    [HttpGet]
    [Authorize(Policy = "documents.view")]
    public async Task<ApiResponse<PagedResponse<DocumentDto>>> GetDocuments([FromQuery] GetDocumentsListQuery query)
        => await _mediator.Send(query);

    /// <summary>
    /// Gets details for a document record.
    /// </summary>
    /// <param name="id">The document ID.</param>
    /// <returns>The document metadata.</returns>
    [HttpGet("{id:int}")]
    [Authorize(Policy = "documents.view")]
    public async Task<ApiResponse<DocumentDto>> GetDocumentById(int id)
        => await _mediator.Send(new GetDocumentByIdQuery(id));

    /// <summary>
    /// Records an uploaded document and its storage path.
    /// </summary>
    /// <param name="command">The document creation command payload.</param>
    /// <returns>The created document record.</returns>
    [HttpPost]
    [Authorize(Policy = "documents.manage")]
    public async Task<ApiResponse<DocumentDto>> CreateDocument([FromBody] CreateDocumentCommand command)
        => await _mediator.Send(command);

    /// <summary>
    /// Deletes a document record.
    /// </summary>
    /// <param name="id">The document ID.</param>
    /// <returns>A confirmation response.</returns>
    [HttpDelete("{id:int}")]
    [Authorize(Policy = "documents.manage")]
    public async Task<ApiResponse<bool>> DeleteDocument(int id)
        => await _mediator.Send(new DeleteDocumentCommand(id));
}
