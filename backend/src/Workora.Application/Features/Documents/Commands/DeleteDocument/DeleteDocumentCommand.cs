using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Documents.DTOs;
namespace Workora.Application.Features.Documents.Commands.DeleteDocument;

/// <summary>
/// Command to soft-delete a document record.
/// </summary>
public record DeleteDocumentCommand(int Id) : IRequest<ApiResponse<bool>>;
