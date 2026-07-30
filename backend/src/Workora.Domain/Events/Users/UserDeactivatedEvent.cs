using Workora.Domain.Common;

namespace Workora.Domain.Events.Users;

/// <summary>
/// Domain event raised when a user account is deactivated.
/// </summary>
/// <param name="UserId">The ID of the deactivated user.</param>
public record UserDeactivatedEvent(int UserId) : IDomainEvent;
