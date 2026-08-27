using FluentValidation;
using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Companies.DTOs;
namespace Workora.Application.Features.Companies.Commands.UploadCompanyLogo;

/// <summary>
/// Command to update the company logo URL.
/// </summary>
public record UploadCompanyLogoCommand(int? CompanyId, string LogoUrl) : IRequest<ApiResponse<bool>>;
