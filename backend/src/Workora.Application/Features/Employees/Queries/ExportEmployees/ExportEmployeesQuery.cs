using AutoMapper;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Queries.ExportEmployees;

/// <summary>
/// Query to retrieve a filtered employee list for export purposes.
/// </summary>
public record ExportEmployeesQuery(
    string? SearchTerm = null,
    int? DepartmentId = null,
    int? DesignationId = null,
    int? BranchId = null,
    EmploymentStatus? Status = null) : IRequest<ApiResponse<IReadOnlyList<EmployeeDto>>>;
