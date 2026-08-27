using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.GetEmployeesList;

/// <summary>
/// Query to retrieve a paginated and filtered list of employees.
/// </summary>
public record GetEmployeesListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    string? SearchTerm = null,
    int? DepartmentId = null,
    int? DesignationId = null,
    int? BranchId = null,
    EmploymentStatus? Status = null,
    int? CompanyId = null) : IRequest<ApiResponse<PagedResponse<EmployeeDto>>>;
