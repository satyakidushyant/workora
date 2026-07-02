namespace Workora.Domain.Common;

/// <summary>
/// Marker interface to indicate an entity supports soft deletion.
/// </summary>
public interface ISoftDeletable
{
    /// <summary>
    /// Indicates if the entity is soft-deleted.
    /// </summary>
    bool IsDeleted { get; set; }

    /// <summary>
    /// The date and time when the entity was soft-deleted.
    /// </summary>
    DateTimeOffset? DeletedAt { get; set; }

    /// <summary>
    /// The identifier of the user who performed the soft deletion.
    /// </summary>
    Guid? DeletedBy { get; set; }
}
