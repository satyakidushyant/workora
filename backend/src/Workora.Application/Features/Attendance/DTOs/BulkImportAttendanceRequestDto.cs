using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.DTOs;

/// <summary>
/// Request payload for bulk importing attendance.
/// </summary>
public record BulkImportAttendanceRequestDto(
    IReadOnlyList<BulkImportAttendanceItemDto> Records);
