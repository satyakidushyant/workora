using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.DTOs;

/// <summary>
/// Request payload for submitting a leave application.
/// </summary>
public record ApplyLeaveRequestDto(
    int LeaveTypeId,
    DateOnly StartDate,
    DateOnly EndDate,
    decimal DaysCount,
    string Reason);
