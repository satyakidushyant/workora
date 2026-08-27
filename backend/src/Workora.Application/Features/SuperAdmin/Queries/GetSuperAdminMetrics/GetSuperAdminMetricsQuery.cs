using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.SuperAdmin.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.SuperAdmin.Queries.GetSuperAdminMetrics;

/// <summary>
/// Query to retrieve high-level global SaaS platform metrics.
/// </summary>
public record GetSuperAdminMetricsQuery : IRequest<ApiResponse<SuperAdminMetricsDto>>;
