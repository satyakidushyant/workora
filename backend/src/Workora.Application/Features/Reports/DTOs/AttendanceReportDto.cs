using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.DTOs;

/// <summary>
/// Real-time today attendance analytics report DTO.
/// </summary>
public record AttendanceReportDto(
    int TotalPresent,
    int OnTime,
    int Late,
    int CheckedOut);
