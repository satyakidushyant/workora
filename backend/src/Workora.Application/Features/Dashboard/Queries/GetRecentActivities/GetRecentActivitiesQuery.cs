using MediatR;
using Workora.Application.Features.Dashboard.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.Queries.GetRecentActivities;

/// <summary>
/// Query to retrieve a feed of recent system audit actions for the dashboard.
/// </summary>
public record GetRecentActivitiesQuery(int Limit = 10) : IRequest<ApiResponse<IReadOnlyList<RecentActivityDto>>>;
