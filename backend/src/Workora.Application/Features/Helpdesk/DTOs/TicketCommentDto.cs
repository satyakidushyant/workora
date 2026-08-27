using Workora.Domain.Enums;
using Workora.Shared.Responses;

namespace Workora.Application.Features.Helpdesk.DTOs;

/// <summary>
/// Data transfer object for a comment on a ticket.
/// </summary>
public record TicketCommentDto(
    int Id,
    Guid Uuid,
    int TicketId,
    int UserId,
    string? AuthorName,
    string CommentText,
    string? AttachmentUrl,
    bool IsInternalOnly,
    DateTimeOffset CreatedAt);
