using AutoMapper;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.GetEmployeeEmploymentHistory;

/// <summary>
/// Query to retrieve an employee's historical transitions and events.
/// </summary>
public record GetEmployeeEmploymentHistoryQuery(int Id) : IRequest<ApiResponse<IReadOnlyList<EmploymentHistoryDto>>>;
