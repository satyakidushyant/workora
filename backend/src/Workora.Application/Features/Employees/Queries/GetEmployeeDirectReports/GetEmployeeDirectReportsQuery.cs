using AutoMapper;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.GetEmployeeDirectReports;

/// <summary>
/// Query to retrieve an employee's direct reporting subordinates.
/// </summary>
public record GetEmployeeDirectReportsQuery(int Id) : IRequest<ApiResponse<IReadOnlyList<EmployeeDto>>>;
