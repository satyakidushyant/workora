using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.TransferEmployee;

/// <summary>
/// Command to transfer an employee across departments, designations, or branches.
/// </summary>
public record TransferEmployeeCommand(
    int Id,
    int DepartmentId,
    int DesignationId,
    int BranchId,
    int? ManagerId,
    string? Notes) : IRequest<ApiResponse<EmployeeDto>>;
