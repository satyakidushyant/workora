using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Commands.CheckOut;

/// <summary>
/// Command to register the employee's check-out timestamp.
/// </summary>
public record CheckOutCommand(string? Remarks = null) : IRequest<ApiResponse<AttendanceRecordDto>>;
