using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.DTOs;

/// <summary>
/// Request payload for clocking out.
/// </summary>
public record CheckOutRequestDto(
    string? Remarks);
