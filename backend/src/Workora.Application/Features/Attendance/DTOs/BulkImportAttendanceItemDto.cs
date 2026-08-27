using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.DTOs;

/// <summary>
/// Item in a bulk attendance import payload.
/// </summary>
public record BulkImportAttendanceItemDto(
    string EmployeeCode,
    DateOnly AttendanceDate,
    DateTimeOffset? CheckInTime,
    DateTimeOffset? CheckOutTime,
    string? Remarks);
