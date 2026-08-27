using AutoMapper;
using MediatR;
using Workora.Application.Common.Interfaces;
using Workora.Application.Features.Departments.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.Queries.GetDepartmentsList;

/// <summary>
/// Query to get a paginated list of departments.
/// </summary>
public record GetDepartmentsListQuery(
    int PageNumber = 1,
    int PageSize = 25,
    string? SearchTerm = null,
    int? CompanyId = null) : IRequest<ApiResponse<PagedResponse<DepartmentDto>>>;
