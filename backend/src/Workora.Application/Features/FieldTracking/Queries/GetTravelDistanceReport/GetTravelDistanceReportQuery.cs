using MediatR;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.FieldTracking.DTOs;
namespace Workora.Application.Features.FieldTracking.Queries.GetTravelDistanceReport;

/// <summary>
/// Query to compute total kilometers traveled by employee in a period.
/// </summary>
public record GetTravelDistanceReportQuery(int EmployeeId, DateOnly FromDate, DateOnly ToDate) : IRequest<ApiResponse<TravelDistanceSummaryDto>>;
