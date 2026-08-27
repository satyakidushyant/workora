using FluentValidation;
using MediatR;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Employees.DTOs;
namespace Workora.Application.Features.Employees.Commands.TerminateEmployee;

/// <summary>
/// Command to terminate an employee's employment.
/// </summary>
public record TerminateEmployeeCommand(
    int Id,
    DateOnly TerminationDate,
    string? Reason) : IRequest<ApiResponse<bool>>;
