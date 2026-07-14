using Workora.Domain.Common;

namespace Workora.Domain.Events.Authentication;

/// <summary>
/// Domain event raised when a password reset is requested.
/// </summary>
/// <param name="Email">The user's email address.</param>
/// <param name="ResetLink">The password reset link.</param>
public record PasswordResetRequestedEvent(string Email, string ResetLink) : IDomainEvent;
