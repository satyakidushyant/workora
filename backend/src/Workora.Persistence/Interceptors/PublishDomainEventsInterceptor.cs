using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Workora.Domain.Common;

namespace Workora.Persistence.Interceptors;

/// <summary>
/// Interceptor to automatically publish domain events upon saving changes.
/// </summary>
public class PublishDomainEventsInterceptor : SaveChangesInterceptor
{
    private readonly IPublisher _publisher;

    /// <summary>
    /// Initializes a new instance of the <see cref="PublishDomainEventsInterceptor"/> class.
    /// </summary>
    /// <param name="publisher">The MediatR publisher.</param>
    public PublishDomainEventsInterceptor(IPublisher publisher)
    {
        _publisher = publisher;
    }

    /// <summary>
    /// Called before saving changes to the database.
    /// </summary>
    public override InterceptionResult<int> SavingChanges(DbContextEventData eventData, InterceptionResult<int> result)
    {
        PublishDomainEvents(eventData.Context).GetAwaiter().GetResult();
        return base.SavingChanges(eventData, result);
    }

    /// <summary>
    /// Called asynchronously before saving changes to the database.
    /// </summary>
    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result, CancellationToken cancellationToken = default)
    {
        await PublishDomainEvents(eventData.Context);
        return await base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    private async Task PublishDomainEvents(DbContext? dbContext)
    {
        if (dbContext == null) return;

        // Get all entities with domain events
        var entitiesWithEvents = dbContext.ChangeTracker.Entries<BaseEntity>()
            .Where(e => e.Entity.DomainEvents.Any())
            .Select(e => e.Entity)
            .ToList();

        // Extract events
        var domainEvents = entitiesWithEvents
            .SelectMany(e => e.DomainEvents)
            .ToList();

        // Clear events to prevent infinite loops and re-publishing
        entitiesWithEvents.ForEach(e => e.ClearDomainEvents());

        // Publish all events
        foreach (var domainEvent in domainEvents)
        {
            await _publisher.Publish(domainEvent);
        }
    }
}
