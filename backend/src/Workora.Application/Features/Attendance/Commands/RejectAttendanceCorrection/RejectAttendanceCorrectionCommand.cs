using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Attendance.DTOs;
namespace Workora.Application.Features.Attendance.Commands.RejectAttendanceCorrection;

/// <summary>
/// Command to reject an attendance correction request.
/// </summary>
public record RejectAttendanceCorrectionCommand(
    int Id,
    string? Remarks = null) : IRequest<ApiResponse<bool>>;
