using AutoMapper;
using FluentValidation;
using MediatR;
using Workora.Application.Features.Employees.DTOs;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Employees.Commands.PromoteEmployee;

/// <summary>
/// Command to promote an employee to a new designation.
/// </summary>
public record PromoteEmployeeCommand(
    int Id,
    int NewDesignationId,
    decimal? NewBasicSalary = null,
    string? Remarks = null) : IRequest<ApiResponse<EmployeeDto>>;
