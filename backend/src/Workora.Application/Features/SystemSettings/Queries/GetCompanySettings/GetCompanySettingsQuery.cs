using AutoMapper;
using MediatR;
using Workora.Application.Features.SystemSettings.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.SystemSettings.Queries.GetCompanySettings;

/// <summary>
/// Query to list all system configuration settings for a company.
/// </summary>
public record GetCompanySettingsQuery(
    int CompanyId,
    string? Group = null) : IRequest<ApiResponse<IReadOnlyList<SystemSettingDto>>>;
