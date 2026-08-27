using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.DTOs;

/// <summary>
/// DTO representing an employee's assigned compensation structure.
/// </summary>
public record EmployeeSalaryAssignmentDto(
    int Id,
    int EmployeeId,
    int SalaryStructureId,
    string SalaryStructureName,
    decimal BaseSalary,
    DateOnly EffectiveFrom,
    DateOnly? EffectiveTo,
    bool IsActive,
    IReadOnlyList<SalaryComponentDto> Components);
