using MediatR;
using Workora.Application.Features.Holidays.DTOs;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.Queries.GetWeeklyOffPolicy;

/// <summary>
/// Query to fetch weekly-off policy for a company.
/// </summary>
public record GetWeeklyOffPolicyQuery(int CompanyId) : IRequest<ApiResponse<WeeklyOffPolicyDto>>;
