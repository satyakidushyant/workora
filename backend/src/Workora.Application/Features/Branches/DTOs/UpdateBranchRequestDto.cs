using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.DTOs;

/// <summary>
/// Data transfer object for updating an existing branch.
/// </summary>
public record UpdateBranchRequestDto(
    string Name,
    string Code,
    string Location,
    string? Address,
    string Timezone,
    bool IsHeadOffice);
