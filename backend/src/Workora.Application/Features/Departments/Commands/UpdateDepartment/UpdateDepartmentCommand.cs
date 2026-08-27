using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Departments.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Departments.Commands.UpdateDepartment;

/// <summary>
/// Command to update an existing department.
/// </summary>
public record UpdateDepartmentCommand(
    int Id,
    string Code,
    string Name,
    int? HeadEmployeeId,
    int? ParentDepartmentId) : IRequest<ApiResponse<DepartmentDto>>;
