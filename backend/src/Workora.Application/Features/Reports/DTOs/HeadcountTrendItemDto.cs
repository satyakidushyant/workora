using Workora.Shared.Responses;

namespace Workora.Application.Features.Reports.DTOs;

/// <summary>
/// Headcount trend data point.
/// </summary>
public record HeadcountTrendItemDto(
    string Period,
    int Headcount,
    int Joiners,
    int Leavers);
