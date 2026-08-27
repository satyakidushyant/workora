using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Attendance.DTOs;

/// <summary>
/// Request payload for approving or rejecting a correction.
/// </summary>
public record ProcessCorrectionRequestDto(
    string? Remarks);
