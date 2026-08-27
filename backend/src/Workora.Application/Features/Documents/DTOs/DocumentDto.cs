using Workora.Domain.Enums;
using Workora.Shared.Responses;

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
