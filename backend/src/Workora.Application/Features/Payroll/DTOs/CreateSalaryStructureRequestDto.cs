using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.DTOs;

/// <summary>
/// Request payload for creating a salary structure.
/// </summary>
public record CreateSalaryStructureRequestDto(
    int CompanyId,
    string Name,
    string? Description,
    IReadOnlyList<CreateSalaryComponentDto> Components);
