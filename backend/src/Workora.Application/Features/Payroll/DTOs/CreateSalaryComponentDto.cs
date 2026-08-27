using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.DTOs;

/// <summary>
/// Component item for creating a salary structure.
/// </summary>
public record CreateSalaryComponentDto(
    string Name,
    string Code,
    ComponentType Type,
    CalculationType CalculationType,
    decimal DefaultValue,
    bool IsTaxable);
