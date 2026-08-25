namespace Workora.Domain.Enums;

/// <summary>
/// Defines the resolution status of a helpdesk ticket.
/// </summary>
public enum TicketStatus
{
    /// <summary>
    /// Newly raised ticket, awaiting assignment.
    /// </summary>
    Open = 1,

    /// <summary>
    /// Ticket assigned to an HR/IT agent.
    /// </summary>
    Assigned = 2,

    /// <summary>
    /// Ticket investigation or fix is in progress.
    /// </summary>
    InProgress = 3,

    /// <summary>
    /// Resolution provided and awaiting user closure.
    /// </summary>
    Resolved = 4,

    /// <summary>
    /// Ticket closed.
    /// </summary>
    Closed = 5
}
