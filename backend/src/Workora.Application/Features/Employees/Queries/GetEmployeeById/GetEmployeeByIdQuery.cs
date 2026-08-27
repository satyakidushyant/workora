using AutoMapper;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.GetEmployeeById;

/// <summary>
/// Query to retrieve full profile details for a single employee.
/// </summary>
public record GetEmployeeByIdQuery(int Id) : IRequest<ApiResponse<EmployeeDetailDto>>;
