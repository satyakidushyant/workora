using Workora.Shared.Responses;

namespace Workora.Application.Features.Companies.DTOs;

/// <summary>
/// Data transfer object for uploading or setting the company logo.
/// </summary>
public record UploadCompanyLogoRequestDto(
    string LogoUrl);
