using Workora.Domain.Common;
using Workora.Domain.Exceptions;

namespace Workora.Domain.Entities;

/// <summary>
/// Represents a message or status update in a ticket discussion thread.
/// </summary>
public class HelpdeskTicketComment : AuditableEntity
{
    /// <summary>
    /// Foreign key to the parent helpdesk ticket.
    /// </summary>
    public int TicketId { get; private set; }

    /// <summary>
    /// Gets the navigation property for the parent ticket.
    /// </summary>
    public HelpdeskTicket Ticket { get; private set; } = null!;

    /// <summary>
    /// User ID of the comment author.
    /// </summary>
    public int UserId { get; private set; }

    /// <summary>
    /// Gets the navigation property for the user.
    /// </summary>
    public User User { get; private set; } = null!;

    /// <summary>
    /// The message body.
    /// </summary>
    public string CommentText { get; private set; } = string.Empty;

    /// <summary>
    /// Optional attached document/screenshot URL.
    /// </summary>
    public string? AttachmentUrl { get; private set; }

    /// <summary>
    /// Indicates whether this comment is an internal private note between support agents.
    /// </summary>
    public bool IsInternalOnly { get; private set; }

    private HelpdeskTicketComment() { } // EF Core

    /// <summary>
    /// Factory method to create a new ticket comment.
    /// </summary>
    public static HelpdeskTicketComment Create(
        int ticketId,
        int userId,
        string commentText,
        string? attachmentUrl,
        bool isInternalOnly)
    {
        if (string.IsNullOrWhiteSpace(commentText))
            throw new DomainException("Comment text cannot be empty.");

        return new HelpdeskTicketComment
        {
            TicketId = ticketId,
            UserId = userId,
            CommentText = commentText,
            AttachmentUrl = attachmentUrl,
            IsInternalOnly = isInternalOnly
        };
    }
}
