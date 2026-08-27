using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.ReactivateEmployee;

/// <summary>
/// Command to reactivate / rehire a previously terminated employee.
/// </summary>
public record ReactivateEmployeeCommand(
    int Id,
    int DepartmentId,
    int DesignationId,
    int BranchId,
    int? ManagerId,
    string? Notes) : IRequest<ApiResponse<EmployeeDto>>;
