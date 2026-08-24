using Workora.Domain.Common;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents an immutable historical audit record of system operations.
/// </summary>
public class AuditLog : BaseEntity
{
    /// <summary>
    /// Foreign key identifier for the acting user if authenticated.
    /// </summary>
    public int? UserId { get; private set; }

    /// <summary>
    /// User name or email of the actor.
    /// </summary>
    public string? ActorEmail { get; private set; }

    /// <summary>
    /// Action verb performed (e.g., "Create", "Update", "Delete", "Disburse").
    /// </summary>
    public string Action { get; private set; } = null!;

    /// <summary>
    /// Target entity type name (e.g., "Employee", "PayrollRun", "LeaveRequest").
    /// </summary>
    public string EntityName { get; private set; } = null!;

    /// <summary>
    /// Target entity primary key identifier.
    /// </summary>
    public string? EntityId { get; private set; }

    /// <summary>
    /// JSON serialized state before change.
    /// </summary>
    public string? OldValues { get; private set; }

    /// <summary>
    /// JSON serialized state after change.
    /// </summary>
    public string? NewValues { get; private set; }

    /// <summary>
    /// IP address of the client making the request.
    /// </summary>
    public string? IpAddress { get; private set; }

    /// <summary>
    /// User Agent string of the client browser.
    /// </summary>
    public string? UserAgent { get; private set; }

    /// <summary>
    /// Timestamp when action occurred.
    /// </summary>
    public DateTimeOffset Timestamp { get; private set; }

    /// <summary>
    /// Parameterless constructor for EF Core.
    /// </summary>
    private AuditLog() { }

    /// <summary>
    /// Creates a new AuditLog entry.
    /// </summary>
    public static AuditLog Create(
        string action,
        string entityName,
        string? entityId = null,
        int? userId = null,
        string? actorEmail = null,
        string? oldValues = null,
        string? newValues = null,
        string? ipAddress = null,
        string? userAgent = null)
    {
        return new AuditLog
        {
            Action = action,
            EntityName = entityName,
            EntityId = entityId,
            UserId = userId,
            ActorEmail = actorEmail,
            OldValues = oldValues,
            NewValues = newValues,
            IpAddress = ipAddress,
            UserAgent = userAgent,
            Timestamp = DateTimeOffset.UtcNow,
            IsActive = true
        };
    }
}
