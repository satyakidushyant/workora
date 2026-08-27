using AutoMapper;
using MediatR;
using Workora.Application.Features.Departments.DTOs;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.Queries.GetDepartmentById;

/// <summary>
/// Query to retrieve detailed information for a department.
/// </summary>
public record GetDepartmentByIdQuery(int Id) : IRequest<ApiResponse<DepartmentDetailDto>>;
