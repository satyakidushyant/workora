using Workora.Domain.Enums;

namespace Workora.Application.Features.Helpdesk.DTOs;

/// <summary>
/// Data transfer object for a helpdesk support ticket.
/// </summary>
public record HelpdeskTicketDto(
    int Id,
    Guid Uuid,
    int CompanyId,
    string TicketNumber,
    int RaisedByEmployeeId,
    string? RaisedByEmployeeName,
    int? AssignedToEmployeeId,
    string? AssignedToEmployeeName,
    TicketCategory Category,
    string Subject,
    string Description,
    TicketPriority Priority,
    TicketStatus Status,
    DateTimeOffset? ResolvedAt,
    string? ResolutionNotes,
    List<TicketCommentDto>? Comments,
    DateTimeOffset CreatedAt);

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
