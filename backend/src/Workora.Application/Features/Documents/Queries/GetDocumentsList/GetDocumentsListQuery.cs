using MediatR;
using Workora.Application.Common.Models;
using Workora.Application.Features.Documents.DTOs;
using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Documents.Queries.GetDocumentsList;

/// <summary>
/// Query to retrieve a paginated list of documents with dynamic pagination and filtering.
/// </summary>
public record GetDocumentsListQuery : PagedQueryBase, IRequest<ApiResponse<PagedResponse<DocumentDto>>>
{
    /// <summary>
    /// Gets or init optional filter for target company ID.
    /// </summary>
    public int? CompanyId { get; init; }

    /// <summary>
    /// Gets or init optional filter for employee ID.
    /// </summary>
    public int? EmployeeId { get; init; }

    /// <summary>
    /// Gets or init optional filter for document category.
    /// </summary>
    public DocumentCategory? Category { get; init; }
}

