using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Holidays.DTOs;

/// <summary>
/// Data transfer object representing a holiday.
/// </summary>
public record HolidayDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    int? BranchId,
    string? BranchName,
    string Name,
    DateOnly Date,
    HolidayType Type,
    string? Description,
    bool IsActive,
    DateTimeOffset CreatedAt);
