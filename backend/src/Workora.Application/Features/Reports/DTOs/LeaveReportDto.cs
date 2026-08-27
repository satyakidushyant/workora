using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.DTOs;

/// <summary>
/// Leave utilization report DTO.
/// </summary>
public record LeaveReportDto(
    int Year,
    IReadOnlyDictionary<string, int> UtilizationByType);
