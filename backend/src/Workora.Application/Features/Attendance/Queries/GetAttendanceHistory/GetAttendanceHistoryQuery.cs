using AutoMapper;
using MediatR;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Queries.GetAttendanceHistory;

/// <summary>
/// Query to get attendance logs for an employee across a date range.
/// </summary>
public record GetAttendanceHistoryQuery(
    int EmployeeId,
    DateOnly StartDate,
    DateOnly EndDate) : IRequest<ApiResponse<IReadOnlyList<AttendanceRecordDto>>>;
