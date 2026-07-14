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

    private readonly List<IDomainEvent> _domainEvents = new();

    /// <summary>
    /// Gets the collection of domain events currently registered to this entity.
    /// </summary>
    public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    /// <summary>
    /// Adds a domain event to the entity.
    /// </summary>
    /// <param name="domainEvent">The domain event.</param>
    public void AddDomainEvent(IDomainEvent domainEvent) => _domainEvents.Add(domainEvent);

    /// <summary>
    /// Removes a domain event from the entity.
    /// </summary>
    /// <param name="domainEvent">The domain event.</param>
    public void RemoveDomainEvent(IDomainEvent domainEvent) => _domainEvents.Remove(domainEvent);

    /// <summary>
    /// Clears all domain events from the entity.
    /// </summary>
    public void ClearDomainEvents() => _domainEvents.Clear();
}
