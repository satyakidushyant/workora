using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Domain.ValueObjects;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.CreateEmployee;

/// <summary>
/// Command to onboard a new employee into the system.
/// </summary>
public record CreateEmployeeCommand(
    string FirstName,
    string LastName,
    string Email,
    string? Phone,
    string NationalId,
    DateOnly DateOfBirth,
    Gender Gender,
    MaritalStatus MaritalStatus,
    DateOnly HireDate,
    int DepartmentId,
    int DesignationId,
    int BranchId,
    int? ManagerId,
    EmploymentType EmploymentType,
    string? Address) : IRequest<ApiResponse<EmployeeDto>>;
