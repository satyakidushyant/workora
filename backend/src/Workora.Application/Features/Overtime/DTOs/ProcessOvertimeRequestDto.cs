using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Overtime.DTOs;

/// <summary>
/// Request payload for approving or rejecting an overtime request.
/// </summary>
public record ProcessOvertimeRequestDto(
    string? Comments);
