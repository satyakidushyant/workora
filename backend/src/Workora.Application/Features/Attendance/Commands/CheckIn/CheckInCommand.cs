using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Commands.CheckIn;

/// <summary>
/// Command to register the employee's check-in timestamp.
/// </summary>
public record CheckInCommand(string? Remarks = null) : IRequest<ApiResponse<AttendanceRecordDto>>;
