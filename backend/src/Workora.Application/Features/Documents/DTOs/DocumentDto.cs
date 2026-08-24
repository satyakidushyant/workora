using Workora.Domain.Enums;

namespace Workora.Application.Features.Documents.DTOs;

/// <summary>
/// DTO representing an uploaded document record.
/// </summary>
public record DocumentDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    int? EmployeeId,
    string? EmployeeName,
    string Title,
    string FileName,
    string FilePath,
    string ContentType,
    long FileSizeBytes,
    DocumentCategory Category,
    bool IsActive,
    DateTimeOffset CreatedAt);

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
