using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.DTOs;

/// <summary>
/// Request payload for updating a leave type.
/// </summary>
public record UpdateLeaveTypeRequestDto(
    string Name,
    string Code,
    decimal AnnualQuota,
    bool RequiresHrApproval,
    bool AllowNegativeBalance,
    string? Description);
