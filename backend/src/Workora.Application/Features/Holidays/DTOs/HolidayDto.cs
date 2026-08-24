using Workora.Domain.Enums;

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

/// <summary>
/// Request payload for creating a holiday.
/// </summary>
public record CreateHolidayRequestDto(
    int CompanyId,
    string Name,
    DateOnly Date,
    HolidayType Type,
    int? BranchId,
    string? Description);

/// <summary>
/// Request payload for updating a holiday.
/// </summary>
public record UpdateHolidayRequestDto(
    string Name,
    DateOnly Date,
    HolidayType Type,
    int? BranchId,
    string? Description);
