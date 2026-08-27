using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.DTOs;

/// <summary>
/// Request payload for requesting an attendance correction.
/// </summary>
public record RequestCorrectionRequestDto(
    DateTimeOffset? RequestedCheckInTime,
    DateTimeOffset? RequestedCheckOutTime,
    string Reason);
