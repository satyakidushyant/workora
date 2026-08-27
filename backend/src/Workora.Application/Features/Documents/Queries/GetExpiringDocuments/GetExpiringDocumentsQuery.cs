using MediatR;
using Workora.Application.Features.Documents.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Documents.Queries.GetExpiringDocuments;

/// <summary>
/// Query to retrieve list of employee certificates/documents expiring within 30 days.
/// </summary>
public record GetExpiringDocumentsQuery(int CompanyId) : IRequest<ApiResponse<IReadOnlyList<DocumentDto>>>;
