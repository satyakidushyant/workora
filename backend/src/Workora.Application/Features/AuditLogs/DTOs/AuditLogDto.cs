namespace Workora.Application.Features.AuditLogs.DTOs;

/// <summary>
/// DTO representing an audit trail log entry.
/// </summary>
public record AuditLogDto(
    int Id,
    int? UserId,
    string? ActorEmail,
    string Action,
    string EntityName,
    string? EntityId,
    string? OldValues,
    string? NewValues,
    string? IpAddress,
    string? UserAgent,
    DateTimeOffset Timestamp);
