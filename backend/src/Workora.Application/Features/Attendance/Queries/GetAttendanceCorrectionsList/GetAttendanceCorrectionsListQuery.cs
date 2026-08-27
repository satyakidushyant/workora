using AutoMapper;
using MediatR;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Queries.GetAttendanceCorrectionsList;

/// <summary>
/// Query to retrieve a paginated list of attendance correction requests.
/// </summary>
public record GetAttendanceCorrectionsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    CorrectionStatus? Status = null) : IRequest<ApiResponse<PagedResponse<AttendanceCorrectionDto>>>;
