using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Payroll.DTOs;

/// <summary>
/// DTO representing a salary structure template.
/// </summary>
public record SalaryStructureDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    string Name,
    string? Description,
    IReadOnlyList<SalaryComponentDto> Components,
    bool IsActive,
    DateTimeOffset CreatedAt);
