using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Attendance.DTOs;
namespace Workora.Application.Features.Attendance.Commands.RequestAttendanceCorrection;

/// <summary>
/// Command to request a correction to an existing attendance record.
/// </summary>
public record RequestAttendanceCorrectionCommand(
    int AttendanceRecordId,
    DateTimeOffset? RequestedCheckInTime,
    DateTimeOffset? RequestedCheckOutTime,
    string Reason) : IRequest<ApiResponse<bool>>;
