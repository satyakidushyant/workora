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
