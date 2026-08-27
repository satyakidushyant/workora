using MediatR;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.Commands.UpdateWeeklyOffPolicy;

/// <summary>
/// Command to update weekly off policy.
/// </summary>
public record UpdateWeeklyOffPolicyCommand(
    int CompanyId,
    string WeeklyOffDays,
    bool AlternateSaturdayOff) : IRequest<ApiResponse<WeeklyOffPolicyDto>>;
