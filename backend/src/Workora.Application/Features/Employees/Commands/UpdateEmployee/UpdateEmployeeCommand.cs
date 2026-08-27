using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.UpdateEmployee;

/// <summary>
/// Command to update an employee profile by administrative personnel.
/// </summary>
public record UpdateEmployeeCommand(
    int Id,
    string FirstName,
    string LastName,
    string? Phone,
    DateOnly DateOfBirth,
    Gender Gender,
    MaritalStatus MaritalStatus,
    int? ManagerId,
    string? Address) : IRequest<ApiResponse<EmployeeDto>>;
