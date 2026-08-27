using Workora.Shared.Responses;

namespace Workora.Application.Features.Compliance.DTOs;

/// <summary>
/// ECR or statutory filing text export representation.
/// </summary>
public record StatutoryExportFileDto(
    string FileName,
    string ContentType,
    string FileContentBase64);
