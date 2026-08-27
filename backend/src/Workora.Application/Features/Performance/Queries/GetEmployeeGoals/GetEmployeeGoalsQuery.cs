using AutoMapper;
using MediatR;
using Workora.Application.Features.Performance.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Performance.Queries.GetEmployeeGoals;

/// <summary>
/// Query to list performance goals/KPIs for an employee.
/// </summary>
public record GetEmployeeGoalsQuery(
    int EmployeeId,
    GoalStatus? Status = null) : IRequest<ApiResponse<IReadOnlyList<GoalDto>>>;
