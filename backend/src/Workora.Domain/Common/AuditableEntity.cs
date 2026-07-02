namespace Workora.Domain.Common;

/// <summary>
/// Base class for entities that require auditing and soft deletion.
/// </summary>
public abstract class AuditableEntity : BaseEntity, ISoftDeletable
{
    /// <summary>
    /// The date and time when the entity was created.
    /// </summary>
    public DateTimeOffset CreatedAt { get; set; }

    /// <summary>
    /// The identifier of the user who created the entity.
    /// </summary>
    public Guid? CreatedBy { get; set; }

    /// <summary>
    /// The date and time when the entity was last updated.
    /// </summary>
    public DateTimeOffset? UpdatedAt { get; set; }

    /// <summary>
    /// The identifier of the user who last updated the entity.
    /// </summary>
    public Guid? UpdatedBy { get; set; }

    /// <summary>
    /// Indicates if the entity is soft-deleted.
    /// </summary>
    public bool IsDeleted { get; set; }

    /// <summary>
    /// The date and time when the entity was soft-deleted.
    /// </summary>
    public DateTimeOffset? DeletedAt { get; set; }

    /// <summary>
    /// The identifier of the user who performed the soft deletion.
    /// </summary>
    public Guid? DeletedBy { get; set; }
}
