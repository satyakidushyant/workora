using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.SystemSettings.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SystemSettings.Commands.UpdateCompanySettings;

/// <summary>
/// Command to update batch system configuration settings for a company.
/// </summary>
public record UpdateCompanySettingsCommand(
    int CompanyId,
    IReadOnlyList<SettingItemDto> Settings) : IRequest<ApiResponse<IReadOnlyList<SystemSettingDto>>>;
