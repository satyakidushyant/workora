using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.DTOs;

/// <summary>
/// Request payload for approving or rejecting a leave request.
/// </summary>
public record ProcessLeaveRequestDto(
    string? Comments);
