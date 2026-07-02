using System.ComponentModel;

namespace Workora.Domain.Enums;

/// <summary>
/// Defines standard response messages used across the application.
/// </summary>
public enum ResponseMessage
{
    [Description("Operation successful.")]
    Success,
    
    [Description("Operation failed.")]
    Failed,
    
    [Description("Access forbidden.")]
    Forbidden,
    
    [Description("Unauthorized access.")]
    Unauthorized,
    
    [Description("Invalid email or password.")]
    InvalidCredentials,
    
    [Description("Account is temporarily locked.")]
    AccountLocked,
    
    [Description("User not found or inactive.")]
    UserNotFound,
    
    [Description("Invalid or expired token.")]
    InvalidToken,
    
    [Description("An unexpected error occurred.")]
    UnexpectedError,
    
    [Description("Incorrect old password.")]
    IncorrectOldPassword
}
