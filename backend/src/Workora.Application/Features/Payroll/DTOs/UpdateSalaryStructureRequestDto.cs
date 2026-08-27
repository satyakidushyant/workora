using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.DTOs;

/// <summary>
/// Request payload for updating a salary structure.
/// </summary>
public record UpdateSalaryStructureRequestDto(
    string Name,
    string? Description,
    IReadOnlyList<CreateSalaryComponentDto> Components);
