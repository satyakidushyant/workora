using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.DTOs;

/// <summary>
/// Headcount report response DTO.
/// </summary>
public record HeadcountReportDto(
    int TotalEmployees,
    int ActiveEmployees,
    IReadOnlyList<HeadcountTrendItemDto> Trend);
