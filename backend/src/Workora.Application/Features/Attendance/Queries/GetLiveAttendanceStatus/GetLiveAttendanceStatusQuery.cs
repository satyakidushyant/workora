using MediatR;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;

using Workora.Application.Features.Attendance.DTOs;
namespace Workora.Application.Features.Attendance.Queries.GetLiveAttendanceStatus;

/// <summary>
/// Query to retrieve live real-time attendance dashboard metrics.
/// </summary>
public record GetLiveAttendanceStatusQuery(int CompanyId) : IRequest<ApiResponse<LiveAttendanceStatusDto>>;
