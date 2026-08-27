using AutoMapper;
using MediatR;
using Workora.Application.Features.Documents.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Documents.Queries.GetDocumentById;

/// <summary>
/// Query to retrieve a document by ID.
/// </summary>
public record GetDocumentByIdQuery(int Id) : IRequest<ApiResponse<DocumentDto>>;
