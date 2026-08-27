using FluentValidation;
using MediatR;
using Workora.Domain.Entities;
using Workora.Domain.Enums;
using Workora.Domain.Extensions;
using Workora.Domain.Interfaces;
using Workora.Shared.Responses;

using Workora.Application.Features.Payroll.DTOs;
namespace Workora.Application.Features.Payroll.Commands.AssignSalaryStructure;

/// <summary>
/// Command to assign a salary compensation structure and base pay rate to an employee.
/// </summary>
public record AssignSalaryStructureCommand(
    int EmployeeId,
    int SalaryStructureId,
    decimal BaseSalary,
    DateOnly EffectiveFrom,
    DateOnly? EffectiveTo) : IRequest<ApiResponse<bool>>;
