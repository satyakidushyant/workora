using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.DTOs;

/// <summary>
/// DTO representing a salary component line item.
/// </summary>
public record SalaryComponentDto(
    int Id,
    int SalaryStructureId,
    string Name,
    string Code,
    ComponentType Type,
    CalculationType CalculationType,
    decimal DefaultValue,
    bool IsTaxable);
