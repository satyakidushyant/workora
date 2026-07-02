namespace Workora.Domain.Common;

/// <summary>
/// Base class for all entities in the domain model.
/// </summary>
public abstract class BaseEntity
{
    /// <summary>
    /// The primary key for the entity.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The globally unique identifier for the entity, typically used externally.
    /// </summary>
    public Guid Uuid { get; set; } = Guid.NewGuid();

    /// <summary>
    /// Indicates whether the entity is active.
    /// </summary>
    public bool IsActive { get; set; } = true;
}
