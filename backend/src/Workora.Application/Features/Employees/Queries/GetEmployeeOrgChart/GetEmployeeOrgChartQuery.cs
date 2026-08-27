using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.GetEmployeeOrgChart;

/// <summary>
/// Query to retrieve an employee's organizational hierarchy and direct reports.
/// </summary>
public record GetEmployeeOrgChartQuery(int Id) : IRequest<ApiResponse<OrgChartNodeDto>>;
