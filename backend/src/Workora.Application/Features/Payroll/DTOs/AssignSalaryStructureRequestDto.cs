using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.DTOs;

/// <summary>
/// Request payload for assigning a salary structure to an employee.
/// </summary>
public record AssignSalaryStructureRequestDto(
    int EmployeeId,
    int SalaryStructureId,
    decimal BaseSalary,
    DateOnly EffectiveFrom,
    DateOnly? EffectiveTo);
