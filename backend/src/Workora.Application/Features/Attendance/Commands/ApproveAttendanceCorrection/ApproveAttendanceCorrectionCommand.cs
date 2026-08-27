using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Attendance.DTOs;
namespace Workora.Application.Features.Attendance.Commands.ApproveAttendanceCorrection;

/// <summary>
/// Command to approve an attendance correction request.
/// </summary>
public record ApproveAttendanceCorrectionCommand(
    int Id,
    string? Remarks = null) : IRequest<ApiResponse<bool>>;
