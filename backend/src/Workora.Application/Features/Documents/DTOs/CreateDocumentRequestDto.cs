using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Documents.DTOs;

/// <summary>
/// Request payload for saving document metadata.
/// </summary>
public record CreateDocumentRequestDto(
    int CompanyId,
    int? EmployeeId,
    string Title,
    string FileName,
    string FilePath,
    string ContentType,
    long FileSizeBytes,
    DocumentCategory Category);
