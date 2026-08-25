namespace Workora.Domain.Enums;

/// <summary>
/// Defines the priority levels for helpdesk support tickets.
/// </summary>
public enum TicketPriority
{
    /// <summary>
    /// Low priority.
    /// </summary>
    Low = 1,

    /// <summary>
    /// Medium / Standard priority.
    /// </summary>
    Medium = 2,

    /// <summary>
    /// High priority.
    /// </summary>
    High = 3,

    /// <summary>
    /// Urgent / Critical priority.
    /// </summary>
    Urgent = 4
}
