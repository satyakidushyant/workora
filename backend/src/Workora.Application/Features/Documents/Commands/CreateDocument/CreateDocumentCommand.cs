using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Documents.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Documents.Commands.CreateDocument;

/// <summary>
/// Command to save document metadata and file upload path.
/// </summary>
public record CreateDocumentCommand(
    int CompanyId,
    int? EmployeeId,
    string Title,
    string FileName,
    string FilePath,
    string ContentType,
    long FileSizeBytes,
    DocumentCategory Category) : IRequest<ApiResponse<DocumentDto>>;
