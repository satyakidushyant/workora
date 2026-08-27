using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Queries.GetPerformanceCycles;

/// <summary>
/// Query to list performance review cycles.
/// </summary>
public record GetPerformanceCyclesQuery(int CompanyId) : IRequest<ApiResponse<IReadOnlyList<PerformanceCycleDto>>>;
