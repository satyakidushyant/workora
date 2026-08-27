using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Common.Models;
using Workora.Shared.Responses;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Interfaces;

namespace Workora.Application.Features.Leave.Queries.GetMyLeaveBalances;

/// <summary>
/// Query to retrieve leave balances for the currently authenticated employee.
/// </summary>
public record GetMyLeaveBalancesQuery(int Year = 0) : IRequest<ApiResponse<IReadOnlyList<LeaveBalanceDto>>>;
