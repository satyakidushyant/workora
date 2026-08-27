using MediatR;
using Workora.Application.Features.Reports.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.Queries.GetAttendanceReport;

/// <summary>
/// Query to generate daily attendance analytics.
/// </summary>
public record GetAttendanceReportQuery(int? CompanyId = null) : IRequest<ApiResponse<AttendanceReportDto>>;
