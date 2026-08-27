using FluentValidation;
using MediatR;
using Workora.Application.Features.Attendance.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.Commands.BulkImportAttendance;

/// <summary>
/// Command to bulk import attendance records from biometric devices or external systems.
/// </summary>
public record BulkImportAttendanceCommand(
    IReadOnlyList<BulkImportAttendanceItemDto> Records) : IRequest<ApiResponse<int>>;
