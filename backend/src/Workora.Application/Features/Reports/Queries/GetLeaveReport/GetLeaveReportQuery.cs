using MediatR;
using Workora.Application.Features.Reports.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.Queries.GetLeaveReport;

/// <summary>
/// Query to generate annual leave utilization analytics.
/// </summary>
public record GetLeaveReportQuery(
    int? CompanyId = null,
    int? Year = null) : IRequest<ApiResponse<LeaveReportDto>>;
