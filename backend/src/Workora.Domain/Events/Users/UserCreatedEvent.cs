using Workora.Domain.Common;

namespace Workora.Domain.Events.Users;

/// <summary>
/// Domain event raised when a new user account is created.
/// </summary>
/// <param name="UserId">The ID of the newly created user.</param>
/// <param name="Email">The user's email address.</param>
public record UserCreatedEvent(int UserId, string Email) : IDomainEvent;
