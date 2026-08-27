using Workora.Shared.Responses;

namespace Workora.Application.Features.Branches.DTOs;

/// <summary>
/// Data transfer object for creating a new branch.
/// </summary>
public record CreateBranchRequestDto(
    int CompanyId,
    string Name,
    string Code,
    string Location,
    string? Address,
    string Timezone,
    bool IsHeadOffice);
