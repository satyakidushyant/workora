using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.DTOs;

/// <summary>
/// Data transfer object representing a branch summary.
/// </summary>
public record BranchDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    string? CompanyName,
    string Name,
    string Code,
    string Location,
    string? Address,
    string Timezone,
    bool IsHeadOffice,
    bool IsActive,
    DateTimeOffset CreatedAt);
