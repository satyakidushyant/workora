using AutoMapper;
using MediatR;
using Workora.Application.Features.Leave.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Leave.Queries.GetLeaveBalances;

/// <summary>
/// Query to get leave balance quotas for an employee.
/// </summary>
public record GetLeaveBalancesQuery(
    int EmployeeId,
    int Year) : IRequest<ApiResponse<IReadOnlyList<LeaveBalanceDto>>>;
