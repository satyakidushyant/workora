using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Queries.GetTodayAttendanceStatus;

/// <summary>
/// Query to get the caller's check-in / check-out status for today.
/// </summary>
public record GetTodayAttendanceStatusQuery : IRequest<ApiResponse<AttendanceRecordDto?>>;
