using MediatR;
using Workora.Application.Features.Dashboard.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.Queries.GetDashboardSummary;

/// <summary>
/// Query to retrieve executive top-level summary metrics.
/// </summary>
public record GetDashboardSummaryQuery(int CompanyId) : IRequest<ApiResponse<DashboardSummaryDto>>;
