using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.DTOs;

/// <summary>
/// Request payload for clocking in.
/// </summary>
public record CheckInRequestDto(
    string? Remarks);
