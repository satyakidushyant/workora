using MediatR;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Queries.GetAttendanceSummary;

/// <summary>
/// Query to compute monthly attendance summary for an employee.
/// </summary>
public record GetAttendanceSummaryQuery(
    int EmployeeId,
    int Month,
    int Year) : IRequest<ApiResponse<AttendanceSummaryDto>>;
