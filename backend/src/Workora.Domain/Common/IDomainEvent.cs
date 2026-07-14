using MediatR;

namespace Workora.Domain.Common;

/// <summary>
/// Represents a domain event.
/// </summary>
public interface IDomainEvent : INotification
{
}
