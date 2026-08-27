using Workora.Shared.Responses;

namespace Workora.Application.Features.Dashboard.DTOs;

/// <summary>
/// Recent activity feed item.
/// </summary>
public record RecentActivityDto(
    int Id,
    string? ActorEmail,
    string Action,
    string EntityName,
    string? EntityId,
    DateTimeOffset Timestamp);
