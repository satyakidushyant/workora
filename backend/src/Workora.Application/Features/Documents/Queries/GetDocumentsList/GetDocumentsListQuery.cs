using AutoMapper;
using MediatR;
using Workora.Application.Features.Documents.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Documents.Queries.GetDocumentsList;

/// <summary>
/// Query to retrieve a paginated list of documents with optional company, employee, and category filters.
/// </summary>
public record GetDocumentsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    int? CompanyId = null,
    int? EmployeeId = null,
    DocumentCategory? Category = null,
    string? SearchTerm = null) : IRequest<ApiResponse<PagedResponse<DocumentDto>>>;
