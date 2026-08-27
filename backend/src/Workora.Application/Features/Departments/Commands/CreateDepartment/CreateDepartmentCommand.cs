using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Departments.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.Commands.CreateDepartment;

/// <summary>
/// Command to create a new organizational department.
/// </summary>
public record CreateDepartmentCommand(
    int CompanyId,
    string Code,
    string Name,
    int? HeadEmployeeId,
    int? ParentDepartmentId) : IRequest<ApiResponse<DepartmentDto>>;
