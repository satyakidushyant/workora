namespace Workora.Domain.Enums;

/// <summary>
/// Type classification for user notifications.
/// </summary>
public enum NotificationType
{
    /// <summary>
    /// Informational notice.
    /// </summary>
    Info = 1,

    /// <summary>
    /// Warning notice.
    /// </summary>
    Warning = 2,

    /// <summary>
    /// Success confirmation notice.
    /// </summary>
    Success = 3,

    /// <summary>
    /// Urgent alert notice.
    /// </summary>
    Alert = 4
}
